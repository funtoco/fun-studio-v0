-- Add tenant_id to people and visas tables
-- This migration adds tenant_id columns to both people and visas tables
-- and sets up proper RLS policies for tenant-based access control

-- Add tenant_id column to people table
ALTER TABLE "public"."people" 
ADD COLUMN "tenant_id" uuid;

-- Add foreign key constraint to tenants table for people
ALTER TABLE "public"."people" 
ADD CONSTRAINT "people_tenant_id_fkey" 
FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;

-- Create index for better query performance on people
CREATE INDEX "idx_people_tenant_id" ON "public"."people"("tenant_id");

-- Update existing people records to have a default tenant_id
-- This assumes there's a default tenant with a specific ID
-- You may need to adjust this based on your actual default tenant ID
UPDATE "public"."people" 
SET "tenant_id" = '550e8400-e29b-41d4-a716-446655440001' 
WHERE "tenant_id" IS NULL;

-- Make tenant_id NOT NULL after updating existing records for people
ALTER TABLE "public"."people" 
ALTER COLUMN "tenant_id" SET NOT NULL;

-- Add tenant_id column to visas table
ALTER TABLE "public"."visas" 
ADD COLUMN "tenant_id" uuid;

-- Add foreign key constraint to tenants table for visas
ALTER TABLE "public"."visas" 
ADD CONSTRAINT "visas_tenant_id_fkey" 
FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;

-- Create index for better query performance on visas
CREATE INDEX "idx_visas_tenant_id" ON "public"."visas"("tenant_id");

-- Update existing visas records to have tenant_id from their associated people
UPDATE "public"."visas" 
SET "tenant_id" = (
  SELECT "tenant_id" 
  FROM "public"."people" 
  WHERE "people"."id" = "visas"."person_id"
)
WHERE "tenant_id" IS NULL;

-- Make tenant_id NOT NULL after updating existing records for visas
ALTER TABLE "public"."visas" 
ALTER COLUMN "tenant_id" SET NOT NULL;

-- Add RLS policy for tenant-based access on people
CREATE POLICY "people_tenant_access" ON "public"."people"
FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM "public"."user_tenants" 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

-- Add RLS policy for tenant-based access on visas
CREATE POLICY "visas_tenant_access" ON "public"."visas"
FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id 
    FROM "public"."user_tenants" 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

-- Update the RPC function to include tenant_id
CREATE OR REPLACE FUNCTION public.get_public_table_columns(p_table text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean,
  ordinal_position integer
) SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_table NOT IN ('people','visas','meetings') THEN
    RAISE EXCEPTION 'table not allowed';
  END IF;
  RETURN QUERY
  SELECT
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean,
    c.ordinal_position::int
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = p_table
  ORDER BY c.ordinal_position;
END;
$$;

-- Grant necessary permissions
GRANT ALL ON "public"."people" TO "service_role";
GRANT ALL ON "public"."people" TO "authenticated";
GRANT ALL ON "public"."people" TO "anon";

GRANT ALL ON "public"."visas" TO "service_role";
GRANT ALL ON "public"."visas" TO "authenticated";
GRANT ALL ON "public"."visas" TO "anon";
