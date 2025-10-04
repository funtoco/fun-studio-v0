-- Migration: Add is_update_key column to connector_field_mappings table
-- This column indicates whether a field mapping should be used as an update key for Supabase operations

-- Add the is_update_key column
ALTER TABLE "public"."connector_field_mappings" 
ADD COLUMN "is_update_key" boolean NOT NULL DEFAULT false;

-- Create index for the new column for better query performance
CREATE INDEX "idx_connector_field_mappings_is_update_key" 
ON "public"."connector_field_mappings" USING btree ("is_update_key");

-- Add comment to explain the new column
COMMENT ON COLUMN "public"."connector_field_mappings"."is_update_key" 
IS 'Whether this field mapping should be used as an update key for Supabase operations';
