-- Migration: Create connector_app_filters table for Kintone filter conditions
-- This table handles filter conditions for Kintone app data synchronization

CREATE TABLE "public"."connector_app_filters" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "connector_id" uuid NOT NULL,
    "app_mapping_id" uuid NOT NULL, -- Reference to connector_app_mappings
    "field_code" text NOT NULL, -- Kintone field code for filtering
    "field_name" text, -- Display name of the Kintone field
    "field_type" text, -- Kintone field type (SINGLE_LINE_TEXT, etc.)
    "filter_value" text NOT NULL, -- Filter value for equality comparison
    "is_active" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE "public"."connector_app_filters" ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE UNIQUE INDEX "connector_app_filters_pkey" ON "public"."connector_app_filters" USING btree ("id");
CREATE INDEX "idx_connector_app_filters_connector" ON "public"."connector_app_filters" USING btree ("connector_id");
CREATE INDEX "idx_connector_app_filters_app_mapping" ON "public"."connector_app_filters" USING btree ("app_mapping_id");
CREATE INDEX "idx_connector_app_filters_field_code" ON "public"."connector_app_filters" USING btree ("field_code");
CREATE INDEX "idx_connector_app_filters_is_active" ON "public"."connector_app_filters" USING btree ("is_active");

-- Add foreign key constraints
ALTER TABLE "public"."connector_app_filters" 
    ADD CONSTRAINT "connector_app_filters_connector_id_fkey" 
    FOREIGN KEY ("connector_id") REFERENCES "public"."connectors"("id") ON DELETE CASCADE;

ALTER TABLE "public"."connector_app_filters" 
    ADD CONSTRAINT "connector_app_filters_app_mapping_id_fkey" 
    FOREIGN KEY ("app_mapping_id") REFERENCES "public"."connector_app_mappings"("id") ON DELETE CASCADE;

-- Add primary key constraint
ALTER TABLE "public"."connector_app_filters" 
    ADD CONSTRAINT "connector_app_filters_pkey" 
    PRIMARY KEY USING INDEX "connector_app_filters_pkey";

-- Create trigger for updated_at
CREATE TRIGGER "update_connector_app_filters_updated_at"
    BEFORE UPDATE ON "public"."connector_app_filters"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Create RLS policies for connector_app_filters
-- Policy for authenticated users to access filters for their tenant's connectors
CREATE POLICY "Users can access filters for their tenant" ON "public"."connector_app_filters"
    FOR ALL USING (
        "connector_id" IN (
            SELECT "id" FROM "connectors" 
            WHERE "tenant_id" IN (
                SELECT "tenant_id" FROM "user_tenants" 
                WHERE "user_id" = auth.uid() AND "status" = 'active'
            )
        )
    );

-- Policy for service role to access all filters
CREATE POLICY "Service role can access all filters" ON "public"."connector_app_filters"
    FOR ALL USING (true);

-- Grant permissions
GRANT DELETE ON TABLE "public"."connector_app_filters" TO "anon";
GRANT INSERT ON TABLE "public"."connector_app_filters" TO "anon";
GRANT REFERENCES ON TABLE "public"."connector_app_filters" TO "anon";
GRANT SELECT ON TABLE "public"."connector_app_filters" TO "anon";
GRANT TRIGGER ON TABLE "public"."connector_app_filters" TO "anon";
GRANT TRUNCATE ON TABLE "public"."connector_app_filters" TO "anon";
GRANT UPDATE ON TABLE "public"."connector_app_filters" TO "anon";

GRANT DELETE ON TABLE "public"."connector_app_filters" TO "authenticated";
GRANT INSERT ON TABLE "public"."connector_app_filters" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."connector_app_filters" TO "authenticated";
GRANT SELECT ON TABLE "public"."connector_app_filters" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."connector_app_filters" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."connector_app_filters" TO "authenticated";
GRANT UPDATE ON TABLE "public"."connector_app_filters" TO "authenticated";

GRANT DELETE ON TABLE "public"."connector_app_filters" TO "service_role";
GRANT INSERT ON TABLE "public"."connector_app_filters" TO "service_role";
GRANT REFERENCES ON TABLE "public"."connector_app_filters" TO "service_role";
GRANT SELECT ON TABLE "public"."connector_app_filters" TO "service_role";
GRANT TRIGGER ON TABLE "public"."connector_app_filters" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."connector_app_filters" TO "service_role";
GRANT UPDATE ON TABLE "public"."connector_app_filters" TO "service_role";

-- Add comments to explain the structure
COMMENT ON TABLE "public"."connector_app_filters" IS 'Filter conditions for Kintone app data synchronization';
COMMENT ON COLUMN "public"."connector_app_filters"."app_mapping_id" IS 'Reference to the parent app mapping';
COMMENT ON COLUMN "public"."connector_app_filters"."field_code" IS 'Kintone field code for filtering';
COMMENT ON COLUMN "public"."connector_app_filters"."field_name" IS 'Display name of the Kintone field';
COMMENT ON COLUMN "public"."connector_app_filters"."field_type" IS 'Kintone field data type';
COMMENT ON COLUMN "public"."connector_app_filters"."filter_value" IS 'Filter value for equality comparison';
COMMENT ON COLUMN "public"."connector_app_filters"."is_active" IS 'Whether this filter is currently active';
