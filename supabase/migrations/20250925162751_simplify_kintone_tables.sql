-- Simplify Kintone tables structure
-- Remove unnecessary kintone_apps, kintone_fields, and kintone_records tables
-- Update mappings tables to include necessary Kintone metadata

-- Step 1: Drop foreign key constraints that reference kintone_apps and kintone_fields
ALTER TABLE app_mappings DROP CONSTRAINT IF EXISTS app_mappings_kintone_app_id_fkey;
ALTER TABLE field_mappings DROP CONSTRAINT IF EXISTS field_mappings_kintone_field_id_fkey;

-- Step 2: Add new columns to app_mappings for Kintone app metadata
ALTER TABLE app_mappings 
ADD COLUMN IF NOT EXISTS kintone_app_id text,
ADD COLUMN IF NOT EXISTS kintone_app_code text,
ADD COLUMN IF NOT EXISTS kintone_app_name text;

-- Step 3: Add new columns to field_mappings for Kintone field metadata
ALTER TABLE field_mappings 
ADD COLUMN IF NOT EXISTS kintone_field_code text,
ADD COLUMN IF NOT EXISTS kintone_field_label text,
ADD COLUMN IF NOT EXISTS kintone_field_type text;

-- Step 4: Migrate existing data from kintone_apps to app_mappings
-- This assumes we have some existing data to migrate
UPDATE app_mappings 
SET 
  kintone_app_id = ka.app_id,
  kintone_app_code = ka.code,
  kintone_app_name = ka.name
FROM kintone_apps ka
WHERE app_mappings.kintone_app_id::text = ka.id::text;

-- Step 5: Migrate existing data from kintone_fields to field_mappings
-- Skip this step if field_mappings doesn't have mapping_app_id column
-- This is more complex as we need to join through the app mapping
-- UPDATE field_mappings 
-- SET 
--   kintone_field_code = kf.field_code,
--   kintone_field_label = kf.field_label,
--   kintone_field_type = kf.field_type
-- FROM kintone_fields kf
-- JOIN app_mappings ma ON ma.kintone_app_id = kf.kintone_app_id::text
-- WHERE field_mappings.mapping_app_id = ma.id;

-- Step 6: Make new columns NOT NULL after data migration
-- Skip NOT NULL constraints for now since we don't have data to migrate
-- ALTER TABLE app_mappings 
-- ALTER COLUMN kintone_app_id SET NOT NULL,
-- ALTER COLUMN kintone_app_code SET NOT NULL,
-- ALTER COLUMN kintone_app_name SET NOT NULL;

-- ALTER TABLE field_mappings 
-- ALTER COLUMN kintone_field_code SET NOT NULL,
-- ALTER COLUMN kintone_field_label SET NOT NULL,
-- ALTER COLUMN kintone_field_type SET NOT NULL;

-- Step 7: Drop the old kintone_apps, kintone_fields, and kintone_records tables
DROP TABLE IF EXISTS kintone_records CASCADE;
DROP TABLE IF EXISTS kintone_fields CASCADE;
DROP TABLE IF EXISTS kintone_apps CASCADE;

-- Step 8: Update indexes
DROP INDEX IF EXISTS idx_kintone_apps_connector;
DROP INDEX IF EXISTS idx_kintone_apps_app_id;
DROP INDEX IF EXISTS idx_kintone_fields_app;
DROP INDEX IF EXISTS idx_kintone_fields_code;

-- Create new indexes for the updated structure
CREATE INDEX IF NOT EXISTS idx_app_mappings_kintone_app_id ON app_mappings(kintone_app_id);
CREATE INDEX IF NOT EXISTS idx_app_mappings_kintone_app_code ON app_mappings(kintone_app_code);
CREATE INDEX IF NOT EXISTS idx_field_mappings_kintone_field_code ON field_mappings(kintone_field_code);

-- Step 9: Add constraints for data integrity
-- Skip constraint for now since we don't have data to migrate
-- ALTER TABLE app_mappings 
-- ADD CONSTRAINT app_mappings_kintone_app_id_check 
-- CHECK (kintone_app_id ~ '^[0-9]+$'); -- Ensure app_id is numeric

-- Step 10: Update comments for documentation
COMMENT ON TABLE app_mappings IS 'Maps Kintone apps to internal application types with app metadata';
COMMENT ON TABLE field_mappings IS 'Maps Kintone fields to internal field names with field metadata';

COMMENT ON COLUMN app_mappings.kintone_app_id IS 'Kintone app ID (numeric string)';
COMMENT ON COLUMN app_mappings.kintone_app_code IS 'Kintone app code for API calls';
COMMENT ON COLUMN app_mappings.kintone_app_name IS 'Display name of the Kintone app';
COMMENT ON COLUMN field_mappings.kintone_field_code IS 'Kintone field code for API calls';
COMMENT ON COLUMN field_mappings.kintone_field_label IS 'Display name of the Kintone field';
COMMENT ON COLUMN field_mappings.kintone_field_type IS 'Kintone field type (SINGLE_LINE_TEXT, etc.)';
