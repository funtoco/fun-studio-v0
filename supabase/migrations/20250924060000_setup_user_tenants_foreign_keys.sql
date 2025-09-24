-- Setup foreign key relationships for user_tenants table
-- Note: Cannot create direct foreign key to auth.users due to Supabase restrictions

-- First, ensure user_tenants table exists with proper structure
CREATE TABLE IF NOT EXISTS user_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  invited_by uuid,
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant_id ON user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_role ON user_tenants(role);
CREATE INDEX IF NOT EXISTS idx_user_tenants_status ON user_tenants(status);

-- Enable RLS
ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own tenant relationships" ON user_tenants;
DROP POLICY IF EXISTS "Users can view tenant members" ON user_tenants;
DROP POLICY IF EXISTS "Tenant owners and admins can manage members" ON user_tenants;
DROP POLICY IF EXISTS "Users can insert their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Users can update their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_tenants;

-- Create RLS policies for user_tenants
-- Users can view their own tenant relationships
CREATE POLICY "Users can view their own tenant relationships" ON user_tenants
  FOR SELECT USING (user_id = auth.uid());

-- Users can view tenant relationships for tenants they belong to
CREATE POLICY "Users can view tenant members" ON user_tenants
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Tenant owners and admins can manage user relationships
CREATE POLICY "Tenant owners and admins can manage members" ON user_tenants
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- Users can insert their own memberships (for signup)
CREATE POLICY "Users can insert their own memberships" ON user_tenants
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own memberships
CREATE POLICY "Users can update their own memberships" ON user_tenants
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own memberships
CREATE POLICY "Users can delete their own memberships" ON user_tenants
  FOR DELETE USING (user_id = auth.uid());

-- Note: Cannot create foreign key constraint to auth.users
-- Instead, we'll use application-level validation and RLS policies
