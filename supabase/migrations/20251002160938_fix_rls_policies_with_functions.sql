-- Fix RLS policies using SECURITY DEFINER functions to avoid circular references
-- This migration creates reusable functions for tenant-based access control
-- Replaces the previous migration 20251002160000_fix_user_tenants_rls_policies.sql

-- 1. Create function to get user's tenant IDs
CREATE OR REPLACE FUNCTION get_user_tenant_ids()
RETURNS TABLE(tenant_id uuid)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT ut.tenant_id 
  FROM user_tenants ut
  WHERE ut.user_id = auth.uid() 
  AND ut.status = 'active';
$$;

-- 2. Create function to check if user is owner/admin of tenant
CREATE OR REPLACE FUNCTION is_user_tenant_owner_or_admin(check_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_tenants ut
    WHERE ut.user_id = auth.uid() 
    AND ut.tenant_id = check_tenant_id
    AND ut.status = 'active'
    AND ut.role IN ('owner', 'admin')
  );
$$;

-- 3. Create function to get user's role in tenant
CREATE OR REPLACE FUNCTION get_user_tenant_role(check_tenant_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT ut.role
  FROM user_tenants ut
  WHERE ut.user_id = auth.uid() 
  AND ut.tenant_id = check_tenant_id
  AND ut.status = 'active'
  LIMIT 1;
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view members of their tenants" ON "public"."user_tenants";
DROP POLICY IF EXISTS "Users can insert memberships" ON "public"."user_tenants";
DROP POLICY IF EXISTS "Tenant owners and admins can update memberships" ON "public"."user_tenants";
DROP POLICY IF EXISTS "Users can update their own membership" ON "public"."user_tenants";
DROP POLICY IF EXISTS "Tenant owners and admins can delete memberships" ON "public"."user_tenants";
DROP POLICY IF EXISTS "Users can delete their own membership" ON "public"."user_tenants";

-- Create new policies using functions

-- 4. Users can view members of their tenants
CREATE POLICY "Users can view members of their tenants"
ON "public"."user_tenants"
FOR SELECT
TO authenticated
USING (tenant_id IN (SELECT get_user_tenant_ids()));

-- 5. Users can insert memberships (own or if they're owner/admin)
CREATE POLICY "Users can insert memberships"
ON "public"."user_tenants"
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR
  is_user_tenant_owner_or_admin(tenant_id)
);

-- 6. Users can update memberships (own or if they're owner/admin)
CREATE POLICY "Users can update memberships"
ON "public"."user_tenants"
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR
  is_user_tenant_owner_or_admin(tenant_id)
)
WITH CHECK (
  user_id = auth.uid()
  OR
  is_user_tenant_owner_or_admin(tenant_id)
);

-- 7. Users can delete memberships (own or if they're owner/admin)
CREATE POLICY "Users can delete memberships"
ON "public"."user_tenants"
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
  OR
  is_user_tenant_owner_or_admin(tenant_id)
);

-- 8. Update tenants table policy to use function
DROP POLICY IF EXISTS "Users can view their tenants" ON "public"."tenants";

CREATE POLICY "Users can view their tenants"
ON "public"."tenants"
FOR SELECT
TO authenticated
USING (id IN (SELECT get_user_tenant_ids()));

-- 9. Update other tenant-related policies to use functions
-- Sync sessions policies
DROP POLICY IF EXISTS "Users can create sync sessions for their tenants" ON "public"."sync_sessions";
DROP POLICY IF EXISTS "Users can update sync sessions for their tenants" ON "public"."sync_sessions";
DROP POLICY IF EXISTS "Users can view sync sessions for their tenants" ON "public"."sync_sessions";

CREATE POLICY "Users can create sync sessions for their tenants"
ON "public"."sync_sessions"
FOR INSERT
TO authenticated
WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids()));

CREATE POLICY "Users can update sync sessions for their tenants"
ON "public"."sync_sessions"
FOR UPDATE
TO authenticated
USING (tenant_id IN (SELECT get_user_tenant_ids()));

CREATE POLICY "Users can view sync sessions for their tenants"
ON "public"."sync_sessions"
FOR SELECT
TO authenticated
USING (tenant_id IN (SELECT get_user_tenant_ids()));

-- Sync item logs policies
DROP POLICY IF EXISTS "Users can create item logs for their tenant sessions" ON "public"."sync_item_logs";
DROP POLICY IF EXISTS "Users can view item logs for their tenant sessions" ON "public"."sync_item_logs";

CREATE POLICY "Users can create item logs for their tenant sessions"
ON "public"."sync_item_logs"
FOR INSERT
TO authenticated
WITH CHECK (
  session_id IN (
    SELECT ss.id 
    FROM sync_sessions ss
    WHERE ss.tenant_id IN (SELECT get_user_tenant_ids())
  )
);

CREATE POLICY "Users can view item logs for their tenant sessions"
ON "public"."sync_item_logs"
FOR SELECT
TO authenticated
USING (
  session_id IN (
    SELECT ss.id 
    FROM sync_sessions ss
    WHERE ss.tenant_id IN (SELECT get_user_tenant_ids())
  )
);

-- Tenant update policy
DROP POLICY IF EXISTS "Tenant owners and admins can update their tenant" ON "public"."tenants";

CREATE POLICY "Tenant owners and admins can update their tenant"
ON "public"."tenants"
FOR UPDATE
TO authenticated
USING (is_user_tenant_owner_or_admin(id));

-- Add comments for documentation
COMMENT ON FUNCTION get_user_tenant_ids() IS 'Returns tenant IDs that the current user belongs to (active status only)';
COMMENT ON FUNCTION is_user_tenant_owner_or_admin(uuid) IS 'Checks if the current user is owner or admin of the specified tenant';
COMMENT ON FUNCTION get_user_tenant_role(uuid) IS 'Returns the current user role in the specified tenant';
