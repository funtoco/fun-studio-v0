-- Fix RLS policies to use auth.users.raw_user_meta_data.tenant_id
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view tenant members" ON user_tenants;
DROP POLICY IF EXISTS "Users can insert their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Users can update their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON user_tenants;

-- Create RLS policies using auth.users.raw_user_meta_data.tenant_id
-- Users can view user_tenants records for their tenant
CREATE POLICY "Users can view tenant members" ON user_tenants
  FOR SELECT USING (
    tenant_id = ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
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

-- Additional policy for tenant owners/admins to manage all members in their tenant
CREATE POLICY "Tenant owners can manage all members" ON user_tenants
  FOR ALL USING (
    tenant_id = ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
  );
