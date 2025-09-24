-- Create tables for Kintone data synchronization
-- This migration creates tables to store Kintone apps, fields, and mappings

-- Kintone apps table - stores app metadata from Kintone
CREATE TABLE IF NOT EXISTS kintone_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id uuid REFERENCES connectors(id) ON DELETE CASCADE,
  app_id text NOT NULL, -- Kintone app ID
  code text NOT NULL, -- Kintone app code
  name text NOT NULL, -- App name
  description text,
  space_id text,
  thread_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_synced_at timestamptz,
  UNIQUE(connector_id, app_id)
);

-- Kintone fields table - stores field definitions from Kintone apps
CREATE TABLE IF NOT EXISTS kintone_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kintone_app_id uuid REFERENCES kintone_apps(id) ON DELETE CASCADE,
  field_code text NOT NULL, -- Field code in Kintone
  field_label text NOT NULL, -- Field display name
  field_type text NOT NULL, -- Field type (SINGLE_LINE_TEXT, NUMBER, etc.)
  required boolean DEFAULT false,
  options jsonb, -- Field-specific options (for dropdowns, etc.)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(kintone_app_id, field_code)
);

-- Mapping apps table - defines which Kintone apps map to which internal apps
CREATE TABLE IF NOT EXISTS mappings_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id uuid REFERENCES connectors(id) ON DELETE CASCADE,
  kintone_app_id uuid REFERENCES kintone_apps(id) ON DELETE CASCADE,
  internal_app_type text NOT NULL, -- 'people', 'visa', etc.
  internal_app_name text NOT NULL, -- Display name for internal app
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(connector_id, internal_app_type)
);

-- Mapping fields table - defines field mappings between Kintone and internal apps
CREATE TABLE IF NOT EXISTS mappings_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_app_id uuid REFERENCES mappings_apps(id) ON DELETE CASCADE,
  kintone_field_id uuid REFERENCES kintone_fields(id) ON DELETE CASCADE,
  internal_field_name text NOT NULL, -- Field name in our system
  internal_field_type text NOT NULL, -- Field type in our system
  is_required boolean DEFAULT false,
  transformation_rule jsonb, -- Any data transformation rules
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(mapping_app_id, kintone_field_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kintone_apps_connector ON kintone_apps(connector_id);
CREATE INDEX IF NOT EXISTS idx_kintone_apps_app_id ON kintone_apps(app_id);
CREATE INDEX IF NOT EXISTS idx_kintone_fields_app ON kintone_fields(kintone_app_id);
CREATE INDEX IF NOT EXISTS idx_kintone_fields_code ON kintone_fields(field_code);
CREATE INDEX IF NOT EXISTS idx_mappings_apps_connector ON mappings_apps(connector_id);
CREATE INDEX IF NOT EXISTS idx_mappings_apps_type ON mappings_apps(internal_app_type);
CREATE INDEX IF NOT EXISTS idx_mappings_fields_mapping ON mappings_fields(mapping_app_id);
CREATE INDEX IF NOT EXISTS idx_mappings_fields_kintone ON mappings_fields(kintone_field_id);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kintone_apps_updated_at BEFORE UPDATE ON kintone_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kintone_fields_updated_at BEFORE UPDATE ON kintone_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mappings_apps_updated_at BEFORE UPDATE ON mappings_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mappings_fields_updated_at BEFORE UPDATE ON mappings_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
