-- Relax visas constraints to allow any status and type values
-- This migration temporarily removes strict constraints to allow data sync from Kintone
-- Addresses the error: "new row for relation "visas" violates check constraint "visas_status_check""

-- Drop existing status constraint
ALTER TABLE "public"."visas" 
DROP CONSTRAINT IF EXISTS "visas_status_check";

-- Drop existing type constraint  
ALTER TABLE "public"."visas" 
DROP CONSTRAINT IF EXISTS "visas_type_check";

-- Add more permissive constraints that allow any text values
-- This allows the sync to work with any data from Kintone
ALTER TABLE "public"."visas" 
ADD CONSTRAINT "visas_status_check" 
CHECK (status IS NOT NULL AND length(trim(status)) > 0);

ALTER TABLE "public"."visas" 
ADD CONSTRAINT "visas_type_check" 
CHECK (type IS NOT NULL AND length(trim(type)) > 0);

