-- Fix RLS policies for people and visas tables
-- Remove old permissive policies that allow all authenticated users access to all data
-- Keep only tenant-based access policies

-- 1. Drop old policies on people table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON "public"."people";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."people";

-- 2. Drop old policies on visas table if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON "public"."visas";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."visas";

-- 3. Ensure tenant-based policies exist
-- Check if people_tenant_access policy exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'people' 
    AND policyname = 'people_tenant_access'
  ) THEN
    CREATE POLICY "people_tenant_access" ON "public"."people"
    FOR ALL USING (
      tenant_id IN (
        SELECT tenant_id 
        FROM "public"."user_tenants" 
        WHERE user_id = auth.uid() 
        AND status = 'active'
      )
    );
  END IF;
END $$;

-- 4. Check if visas_tenant_access policy exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'visas' 
    AND policyname = 'visas_tenant_access'
  ) THEN
    CREATE POLICY "visas_tenant_access" ON "public"."visas"
    FOR ALL USING (
      tenant_id IN (
        SELECT tenant_id 
        FROM "public"."user_tenants" 
        WHERE user_id = auth.uid() 
        AND status = 'active'
      )
    );
  END IF;
END $$;

-- 5. Verify that RLS is enabled on both tables
ALTER TABLE "public"."people" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."visas" ENABLE ROW LEVEL SECURITY;

