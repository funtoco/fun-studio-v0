-- Create data mappings tables for value mapping functionality
-- This migration adds support for mapping Kintone field values to service field values

-- Data mappings table - stores mapping configurations for each app mapping
CREATE TABLE IF NOT EXISTS "public"."data_mappings" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "app_mapping_id" uuid NOT NULL REFERENCES "public"."connector_app_mappings"("id") ON DELETE CASCADE,
  "field_name" text NOT NULL, -- Target field name (e.g., 'status')
  "field_type" text NOT NULL, -- Field type (e.g., 'string', 'number')
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure unique mapping per field per app mapping
  UNIQUE("app_mapping_id", "field_name")
);

-- Field value mappings table - stores the actual value mapping rules
CREATE TABLE IF NOT EXISTS "public"."field_value_mappings" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "data_mapping_id" uuid NOT NULL REFERENCES "public"."data_mappings"("id") ON DELETE CASCADE,
  "source_value" text NOT NULL, -- Kintone field value
  "target_value" text NOT NULL, -- Service field value
  "is_active" boolean DEFAULT true,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure unique mapping per source value per data mapping
  UNIQUE("data_mapping_id", "source_value")
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_data_mappings_app_mapping_id" ON "public"."data_mappings"("app_mapping_id");
CREATE INDEX IF NOT EXISTS "idx_data_mappings_field_name" ON "public"."data_mappings"("field_name");
CREATE INDEX IF NOT EXISTS "idx_field_value_mappings_data_mapping_id" ON "public"."field_value_mappings"("data_mapping_id");
CREATE INDEX IF NOT EXISTS "idx_field_value_mappings_source_value" ON "public"."field_value_mappings"("source_value");

-- Add RLS policies
ALTER TABLE "public"."data_mappings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."field_value_mappings" ENABLE ROW LEVEL SECURITY;

-- RLS policies for data_mappings
CREATE POLICY "Users can view data mappings for their tenant" ON "public"."data_mappings"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "public"."connector_app_mappings" am
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE am.id = data_mappings.app_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

CREATE POLICY "Users can insert data mappings for their tenant" ON "public"."data_mappings"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."connector_app_mappings" am
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE am.id = data_mappings.app_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

CREATE POLICY "Users can update data mappings for their tenant" ON "public"."data_mappings"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "public"."connector_app_mappings" am
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE am.id = data_mappings.app_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

CREATE POLICY "Users can delete data mappings for their tenant" ON "public"."data_mappings"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM "public"."connector_app_mappings" am
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE am.id = data_mappings.app_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

-- RLS policies for field_value_mappings
CREATE POLICY "Users can view field value mappings for their tenant" ON "public"."field_value_mappings"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "public"."data_mappings" dm
      JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE dm.id = field_value_mappings.data_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

CREATE POLICY "Users can insert field value mappings for their tenant" ON "public"."field_value_mappings"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."data_mappings" dm
      JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE dm.id = field_value_mappings.data_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

CREATE POLICY "Users can update field value mappings for their tenant" ON "public"."field_value_mappings"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "public"."data_mappings" dm
      JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE dm.id = field_value_mappings.data_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

CREATE POLICY "Users can delete field value mappings for their tenant" ON "public"."field_value_mappings"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM "public"."data_mappings" dm
      JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
      JOIN "public"."connectors" c ON am.connector_id = c.id
      WHERE dm.id = field_value_mappings.data_mapping_id
      AND c.tenant_id IN (SELECT get_user_tenant_ids())
    )
  );

-- Add comments for documentation
COMMENT ON TABLE "public"."data_mappings" IS 'Stores data mapping configurations for each app mapping';
COMMENT ON COLUMN "public"."data_mappings"."field_name" IS 'Target field name in the service (e.g., status, type)';
COMMENT ON COLUMN "public"."data_mappings"."field_type" IS 'Data type of the target field (string, number, boolean, etc.)';

COMMENT ON TABLE "public"."field_value_mappings" IS 'Stores value mapping rules between Kintone and service fields';
COMMENT ON COLUMN "public"."field_value_mappings"."source_value" IS 'Value from Kintone field';
COMMENT ON COLUMN "public"."field_value_mappings"."target_value" IS 'Mapped value for service field';
