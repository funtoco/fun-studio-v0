-- Migration: Add skip_if_no_update_target column to connector_app_mappings table
-- This column controls whether to skip records when no update target is found during sync

-- Add the skip_if_no_update_target column
ALTER TABLE "public"."connector_app_mappings" 
ADD COLUMN "skip_if_no_update_target" boolean NOT NULL DEFAULT false;

-- Create index for the new column for better query performance
CREATE INDEX "idx_connector_app_mappings_skip_if_no_update_target" 
ON "public"."connector_app_mappings" USING btree ("skip_if_no_update_target");

-- Add comment to explain the new column
COMMENT ON COLUMN "public"."connector_app_mappings"."skip_if_no_update_target" 
IS 'Whether to skip records when no update target is found during sync (true = skip, false = create new record)';
