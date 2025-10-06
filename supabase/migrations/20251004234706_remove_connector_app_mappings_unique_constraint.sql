-- Migration: Remove unique constraint from connector_app_mappings
-- This allows multiple mappings for the same (connector_id, source_app_id, target_app_type) combination

-- Drop the unique constraint
ALTER TABLE "public"."connector_app_mappings" 
    DROP CONSTRAINT IF EXISTS "connector_app_mappings_connector_source_target_key";

-- Drop the unique index
DROP INDEX IF EXISTS "public"."connector_app_mappings_connector_source_target_key";

-- Add comment to explain the change
COMMENT ON TABLE "public"."connector_app_mappings" 
    IS 'Allows multiple mappings for the same (connector_id, source_app_id, target_app_type) combination';
