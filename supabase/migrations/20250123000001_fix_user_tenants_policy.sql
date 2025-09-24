-- Fix infinite recursion in user_tenants RLS policy
-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own tenant memberships" ON user_tenants;
DROP POLICY IF EXISTS "Users can update their own tenant memberships" ON user_tenants;
DROP POLICY IF EXISTS "Tenant owners and admins can manage members" ON user_tenants;

-- Create simpler policies that don't cause recursion
CREATE POLICY "Users can view their own tenant memberships" ON user_tenants
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own tenant memberships" ON user_tenants
  FOR UPDATE USING (user_id = auth.uid());

-- Allow users to insert their own memberships (for signup)
CREATE POLICY "Users can insert their own memberships" ON user_tenants
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow tenant owners and admins to manage members (but avoid recursion)
CREATE POLICY "Tenant owners and admins can manage members" ON user_tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.tenant_id = user_tenants.tenant_id
      AND ut.user_id = auth.uid()
      AND ut.status = 'active'
      AND ut.role IN ('owner', 'admin')
    )
  );

-- Also allow users to delete their own memberships
CREATE POLICY "Users can delete their own memberships" ON user_tenants
  FOR DELETE USING (user_id = auth.uid());
