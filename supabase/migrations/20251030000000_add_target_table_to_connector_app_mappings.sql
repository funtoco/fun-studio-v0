-- Migration: Add target_table to connector_app_mappings
-- Purpose: Allow separating logical target_app_type (e.g., people_image) from physical destination table (e.g., people)

-- 1) Add column as nullable first
ALTER TABLE "public"."connector_app_mappings"
ADD COLUMN IF NOT EXISTS "target_table" text;

-- 2) Backfill existing rows: default target_table = target_app_type
UPDATE "public"."connector_app_mappings"
SET "target_table" = COALESCE("target_table", "target_app_type");

-- 3) Enforce NOT NULL after backfill
ALTER TABLE "public"."connector_app_mappings"
ALTER COLUMN "target_table" SET NOT NULL;

-- 4) (Optional) Helpful index for future lookups by connector and table
CREATE INDEX IF NOT EXISTS "idx_connector_app_mappings_connector_target_table"
ON "public"."connector_app_mappings" USING btree ("connector_id", "target_table");

-- Rollback guidance:
-- To rollback safely, you may drop the column if not used:
-- ALTER TABLE "public"."connector_app_mappings" DROP COLUMN "target_table";

