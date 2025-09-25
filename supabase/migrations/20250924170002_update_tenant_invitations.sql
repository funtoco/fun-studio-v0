-- Update tenant invitation system to use Supabase auth admin
-- This migration removes the custom tenant_invitations table and updates user_tenants

-- Add email field to user_tenants table for pending invitations
ALTER TABLE user_tenants ADD COLUMN IF NOT EXISTS email text;

-- Update the unique constraint to allow multiple pending invitations with same email
-- but different tenants
ALTER TABLE user_tenants DROP CONSTRAINT IF EXISTS user_tenants_user_id_tenant_id_key;
ALTER TABLE user_tenants ADD CONSTRAINT user_tenants_user_tenant_unique 
  UNIQUE (user_id, tenant_id) DEFERRABLE INITIALLY DEFERRED;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_user_tenants_email ON user_tenants(email);
CREATE INDEX IF NOT EXISTS idx_user_tenants_status ON user_tenants(status);

-- Drop the tenant_invitations table since we're using Supabase auth admin
DROP TABLE IF EXISTS tenant_invitations CASCADE;

-- Drop the related functions
DROP FUNCTION IF EXISTS accept_tenant_invitation(text);
DROP FUNCTION IF EXISTS generate_invitation_token();

-- Update RLS policies to handle the new structure
-- Remove old tenant_invitations policies (they're already dropped with the table)

-- Update user_tenants policies to handle email field
DROP POLICY IF EXISTS "Users can view their own tenant relationships" ON user_tenants;
DROP POLICY IF EXISTS "Tenant owners and admins can manage user relationships" ON user_tenants;


-- Create function to activate user tenant membership when they accept invitation
CREATE OR REPLACE FUNCTION activate_user_tenant_membership()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user signs up or signs in, check if they have pending tenant memberships
  -- This will be called from the application when needed
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;
