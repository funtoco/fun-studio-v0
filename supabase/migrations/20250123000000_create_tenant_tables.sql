-- Create tenant management tables
-- This migration creates only the missing tables for tenant management

-- Tenants table - represents companies/organizations
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  settings jsonb DEFAULT '{}'::jsonb,
  max_members integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User-tenant relationships with roles
CREATE TABLE IF NOT EXISTS user_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  invited_by uuid REFERENCES auth.users(id),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- Tenant invitations table
CREATE TABLE IF NOT EXISTS tenant_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
  token text UNIQUE NOT NULL,
  invited_by uuid NOT NULL REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant_id ON user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_role ON user_tenants(role);
CREATE INDEX IF NOT EXISTS idx_user_tenants_status ON user_tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_tenant_id ON tenant_invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_email ON tenant_invitations(email);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_token ON tenant_invitations(token);
CREATE INDEX IF NOT EXISTS idx_tenant_invitations_expires_at ON tenant_invitations(expires_at);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Users can view tenants they belong to" ON tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Tenant owners and admins can update their tenant" ON tenants
  FOR UPDATE USING (
    id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for user_tenants
CREATE POLICY "Users can view their own tenant relationships" ON user_tenants
  FOR SELECT USING (
    user_id = auth.uid() OR 
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Tenant owners and admins can manage user relationships" ON user_tenants
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for tenant_invitations
CREATE POLICY "Users can view invitations for their tenants" ON tenant_invitations
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Tenant owners and admins can manage invitations" ON tenant_invitations
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tenant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_tenant_updated_at();

CREATE TRIGGER update_user_tenants_updated_at
  BEFORE UPDATE ON user_tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_tenant_updated_at();

-- Create function to generate invitation token
CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS text AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ language 'plpgsql';

-- Create function to accept invitation
CREATE OR REPLACE FUNCTION accept_tenant_invitation(invitation_token text)
RETURNS jsonb AS $$
DECLARE
  invitation_record tenant_invitations%ROWTYPE;
  user_record auth.users%ROWTYPE;
  result jsonb;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record 
  FROM tenant_invitations 
  WHERE token = invitation_token 
    AND expires_at > now() 
    AND accepted_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;
  
  -- Get current user
  SELECT * INTO user_record FROM auth.users WHERE id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Check if user email matches invitation email
  IF user_record.email != invitation_record.email THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email mismatch');
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM user_tenants 
    WHERE user_id = auth.uid() AND tenant_id = invitation_record.tenant_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Already a member of this tenant');
  END IF;
  
  -- Add user to tenant
  INSERT INTO user_tenants (user_id, tenant_id, role, status, invited_by, invited_at, joined_at)
  VALUES (
    auth.uid(), 
    invitation_record.tenant_id, 
    invitation_record.role, 
    'active',
    invitation_record.invited_by,
    invitation_record.created_at,
    now()
  );
  
  -- Mark invitation as accepted
  UPDATE tenant_invitations 
  SET accepted_at = now() 
  WHERE id = invitation_record.id;
  
  RETURN jsonb_build_object('success', true, 'tenant_id', invitation_record.tenant_id);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Insert a default tenant for existing users
INSERT INTO tenants (id, name, slug, description, max_members)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default Company',
  'default-company',
  'Default tenant for existing users',
  50
) ON CONFLICT (id) DO NOTHING;
