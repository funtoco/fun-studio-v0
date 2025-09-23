-- Fix cascade delete for connector-related tables
-- This ensures that when a connector is deleted, all related data is automatically deleted

-- Drop existing foreign key constraints and recreate with CASCADE DELETE
ALTER TABLE kintone_apps DROP CONSTRAINT IF EXISTS kintone_apps_connector_id_fkey;
ALTER TABLE kintone_apps ADD CONSTRAINT kintone_apps_connector_id_fkey 
  FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE;

ALTER TABLE kintone_fields DROP CONSTRAINT IF EXISTS kintone_fields_kintone_app_id_fkey;
ALTER TABLE kintone_fields ADD CONSTRAINT kintone_fields_kintone_app_id_fkey 
  FOREIGN KEY (kintone_app_id) REFERENCES kintone_apps(id) ON DELETE CASCADE;

ALTER TABLE mappings_apps DROP CONSTRAINT IF EXISTS mappings_apps_connector_id_fkey;
ALTER TABLE mappings_apps ADD CONSTRAINT mappings_apps_connector_id_fkey 
  FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE;

ALTER TABLE mappings_apps DROP CONSTRAINT IF EXISTS mappings_apps_kintone_app_id_fkey;
ALTER TABLE mappings_apps ADD CONSTRAINT mappings_apps_kintone_app_id_fkey 
  FOREIGN KEY (kintone_app_id) REFERENCES kintone_apps(id) ON DELETE CASCADE;

ALTER TABLE mappings_fields DROP CONSTRAINT IF EXISTS mappings_fields_mapping_app_id_fkey;
ALTER TABLE mappings_fields ADD CONSTRAINT mappings_fields_mapping_app_id_fkey 
  FOREIGN KEY (mapping_app_id) REFERENCES mappings_apps(id) ON DELETE CASCADE;

ALTER TABLE mappings_fields DROP CONSTRAINT IF EXISTS mappings_fields_kintone_field_id_fkey;
ALTER TABLE mappings_fields ADD CONSTRAINT mappings_fields_kintone_field_id_fkey 
  FOREIGN KEY (kintone_field_id) REFERENCES kintone_fields(id) ON DELETE CASCADE;

-- Ensure existing tables have CASCADE DELETE
ALTER TABLE connector_logs DROP CONSTRAINT IF EXISTS connector_logs_connector_id_fkey;
ALTER TABLE connector_logs ADD CONSTRAINT connector_logs_connector_id_fkey 
  FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE;

ALTER TABLE oauth_credentials DROP CONSTRAINT IF EXISTS oauth_credentials_connector_id_fkey;
ALTER TABLE oauth_credentials ADD CONSTRAINT oauth_credentials_connector_id_fkey 
  FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE;

ALTER TABLE connector_secrets DROP CONSTRAINT IF EXISTS connector_secrets_connector_id_fkey;
ALTER TABLE connector_secrets ADD CONSTRAINT connector_secrets_connector_id_fkey 
  FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE;
