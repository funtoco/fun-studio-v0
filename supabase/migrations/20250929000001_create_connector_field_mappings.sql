-- Migration: Create connector_field_mappings table for field-level mappings
-- This table handles mappings between fields in source and target applications

CREATE TABLE "public"."connector_field_mappings" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "connector_id" uuid NOT NULL,
    "app_mapping_id" uuid NOT NULL, -- Reference to connector_app_mappings
    "source_field_id" text NOT NULL, -- Source field identifier
    "source_field_code" text, -- Source field code
    "source_field_name" text, -- Source field name
    "source_field_type" text, -- Source field type (text, number, date, etc.)
    "target_field_id" text NOT NULL, -- Target field identifier
    "target_field_code" text, -- Target field code
    "target_field_name" text, -- Target field name
    "target_field_type" text, -- Target field type
    "is_required" boolean NOT NULL DEFAULT false,
    "is_active" boolean NOT NULL DEFAULT true,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE "public"."connector_field_mappings" ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE UNIQUE INDEX "connector_field_mappings_pkey" ON "public"."connector_field_mappings" USING btree ("id");
CREATE UNIQUE INDEX "connector_field_mappings_app_mapping_source_target_key" 
    ON "public"."connector_field_mappings" USING btree ("app_mapping_id", "source_field_id", "target_field_id");
CREATE INDEX "idx_connector_field_mappings_connector" ON "public"."connector_field_mappings" USING btree ("connector_id");
CREATE INDEX "idx_connector_field_mappings_app_mapping" ON "public"."connector_field_mappings" USING btree ("app_mapping_id");
CREATE INDEX "idx_connector_field_mappings_source_field" ON "public"."connector_field_mappings" USING btree ("source_field_id");
CREATE INDEX "idx_connector_field_mappings_target_field" ON "public"."connector_field_mappings" USING btree ("target_field_id");
CREATE INDEX "idx_connector_field_mappings_is_active" ON "public"."connector_field_mappings" USING btree ("is_active");
CREATE INDEX "idx_connector_field_mappings_sort_order" ON "public"."connector_field_mappings" USING btree ("sort_order");

-- Add foreign key constraints
ALTER TABLE "public"."connector_field_mappings" 
    ADD CONSTRAINT "connector_field_mappings_connector_id_fkey" 
    FOREIGN KEY ("connector_id") REFERENCES "connectors"("id") ON DELETE CASCADE;

ALTER TABLE "public"."connector_field_mappings" 
    ADD CONSTRAINT "connector_field_mappings_app_mapping_id_fkey" 
    FOREIGN KEY ("app_mapping_id") REFERENCES "connector_app_mappings"("id") ON DELETE CASCADE;

-- Add primary key constraint
ALTER TABLE "public"."connector_field_mappings" 
    ADD CONSTRAINT "connector_field_mappings_pkey" 
    PRIMARY KEY USING INDEX "connector_field_mappings_pkey";

-- Add unique constraint
ALTER TABLE "public"."connector_field_mappings" 
    ADD CONSTRAINT "connector_field_mappings_app_mapping_source_target_key" 
    UNIQUE USING INDEX "connector_field_mappings_app_mapping_source_target_key";

-- Create trigger for updated_at
CREATE TRIGGER "update_connector_field_mappings_updated_at"
    BEFORE UPDATE ON "public"."connector_field_mappings"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Grant permissions
GRANT DELETE ON TABLE "public"."connector_field_mappings" TO "anon";
GRANT INSERT ON TABLE "public"."connector_field_mappings" TO "anon";
GRANT REFERENCES ON TABLE "public"."connector_field_mappings" TO "anon";
GRANT SELECT ON TABLE "public"."connector_field_mappings" TO "anon";
GRANT TRIGGER ON TABLE "public"."connector_field_mappings" TO "anon";
GRANT TRUNCATE ON TABLE "public"."connector_field_mappings" TO "anon";
GRANT UPDATE ON TABLE "public"."connector_field_mappings" TO "anon";

GRANT DELETE ON TABLE "public"."connector_field_mappings" TO "authenticated";
GRANT INSERT ON TABLE "public"."connector_field_mappings" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."connector_field_mappings" TO "authenticated";
GRANT SELECT ON TABLE "public"."connector_field_mappings" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."connector_field_mappings" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."connector_field_mappings" TO "authenticated";
GRANT UPDATE ON TABLE "public"."connector_field_mappings" TO "authenticated";

GRANT DELETE ON TABLE "public"."connector_field_mappings" TO "service_role";
GRANT INSERT ON TABLE "public"."connector_field_mappings" TO "service_role";
GRANT REFERENCES ON TABLE "public"."connector_field_mappings" TO "service_role";
GRANT SELECT ON TABLE "public"."connector_field_mappings" TO "service_role";
GRANT TRIGGER ON TABLE "public"."connector_field_mappings" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."connector_field_mappings" TO "service_role";
GRANT UPDATE ON TABLE "public"."connector_field_mappings" TO "service_role";

-- Create RLS policies for connector_field_mappings
-- Policy for authenticated users to access field mappings for their tenant's connectors
CREATE POLICY "Users can access field mappings for their tenant" ON "public"."connector_field_mappings"
    FOR ALL USING (
        "connector_id" IN (
            SELECT "id" FROM "connectors" 
            WHERE "tenant_id" IN (
                SELECT "tenant_id" FROM "user_tenants" 
                WHERE "user_id" = auth.uid() AND "status" = 'active'
            )
        )
    );

-- Policy for service role to access all field mappings
CREATE POLICY "Service role can access all field mappings" ON "public"."connector_field_mappings"
    FOR ALL USING (true);

-- Add comments to explain the structure
COMMENT ON TABLE "public"."connector_field_mappings" IS 'Field-level mappings between source and target applications';
COMMENT ON COLUMN "public"."connector_field_mappings"."app_mapping_id" IS 'Reference to the parent app mapping';
COMMENT ON COLUMN "public"."connector_field_mappings"."source_field_id" IS 'Source field identifier (e.g., Kintone field code)';
COMMENT ON COLUMN "public"."connector_field_mappings"."source_field_code" IS 'Source field code';
COMMENT ON COLUMN "public"."connector_field_mappings"."source_field_name" IS 'Source field display name';
COMMENT ON COLUMN "public"."connector_field_mappings"."source_field_type" IS 'Source field data type';
COMMENT ON COLUMN "public"."connector_field_mappings"."target_field_id" IS 'Target field identifier';
COMMENT ON COLUMN "public"."connector_field_mappings"."target_field_code" IS 'Target field code';
COMMENT ON COLUMN "public"."connector_field_mappings"."target_field_name" IS 'Target field display name';
COMMENT ON COLUMN "public"."connector_field_mappings"."target_field_type" IS 'Target field data type';
COMMENT ON COLUMN "public"."connector_field_mappings"."is_required" IS 'Whether this field mapping is required for sync';
COMMENT ON COLUMN "public"."connector_field_mappings"."is_active" IS 'Whether this field mapping is currently active';
COMMENT ON COLUMN "public"."connector_field_mappings"."sort_order" IS 'Order for displaying field mappings in UI';
