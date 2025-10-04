-- Migration: Fix connector_app_mappings unique constraint to allow multiple mappings per target_app_type
-- This allows multiple Kintone apps to be mapped to the same target app type (e.g., multiple apps to "people")

-- First, drop the existing unique constraint
ALTER TABLE "public"."connector_app_mappings" 
    DROP CONSTRAINT IF EXISTS "connector_app_mappings_connector_id_source_app_key";

-- Drop the existing unique index
DROP INDEX IF EXISTS "public"."connector_app_mappings_connector_id_source_app_key";

-- Create new unique constraint that includes target_app_type
-- This ensures that the same source_app_id can be mapped to different target_app_types
-- but prevents duplicate mappings for the same (connector_id, source_app_id, target_app_type) combination
CREATE UNIQUE INDEX "connector_app_mappings_connector_source_target_key" 
    ON "public"."connector_app_mappings" USING btree ("connector_id", "source_app_id", "target_app_type");

-- Add the new unique constraint
ALTER TABLE "public"."connector_app_mappings" 
    ADD CONSTRAINT "connector_app_mappings_connector_source_target_key" 
    UNIQUE USING INDEX "connector_app_mappings_connector_source_target_key";

-- Add comment to explain the new constraint
COMMENT ON CONSTRAINT "connector_app_mappings_connector_source_target_key" ON "public"."connector_app_mappings" 
    IS 'Ensures unique mapping per (connector_id, source_app_id, target_app_type) combination, allowing multiple apps to map to same target type';
