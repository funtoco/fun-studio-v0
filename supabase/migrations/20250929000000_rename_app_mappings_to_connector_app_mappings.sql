-- Migration: Rename app_mappings to connector_app_mappings and improve structure
-- This migration renames the table and improves the column structure for better clarity

-- First, create the new connector_app_mappings table with improved structure
CREATE TABLE "public"."connector_app_mappings" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "connector_id" uuid NOT NULL,
    "source_app_id" text NOT NULL, -- Kintone app ID (e.g., "13")
    "source_app_name" text NOT NULL, -- Kintone app name (e.g., "就労_就労管理")
    "target_app_type" text NOT NULL, -- Target application type ('people', 'visas', 'meetings', etc.)
    "is_active" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE "public"."connector_app_mappings" ENABLE ROW LEVEL SECURITY;

-- Create indexes for the new table
CREATE UNIQUE INDEX "connector_app_mappings_pkey" ON "public"."connector_app_mappings" USING btree ("id");
CREATE UNIQUE INDEX "connector_app_mappings_connector_id_source_app_key" 
    ON "public"."connector_app_mappings" USING btree ("connector_id", "source_app_id");
CREATE INDEX "idx_connector_app_mappings_connector" ON "public"."connector_app_mappings" USING btree ("connector_id");
CREATE INDEX "idx_connector_app_mappings_source_app" ON "public"."connector_app_mappings" USING btree ("source_app_id");
CREATE INDEX "idx_connector_app_mappings_target_type" ON "public"."connector_app_mappings" USING btree ("target_app_type");
CREATE INDEX "idx_connector_app_mappings_is_active" ON "public"."connector_app_mappings" USING btree ("is_active");

-- No data migration needed - starting with empty tables

-- Add foreign key constraint
ALTER TABLE "public"."connector_app_mappings" 
    ADD CONSTRAINT "connector_app_mappings_connector_id_fkey" 
    FOREIGN KEY ("connector_id") REFERENCES "connectors"("id") ON DELETE CASCADE;

-- Add primary key constraint
ALTER TABLE "public"."connector_app_mappings" 
    ADD CONSTRAINT "connector_app_mappings_pkey" 
    PRIMARY KEY USING INDEX "connector_app_mappings_pkey";

-- Add unique constraint
ALTER TABLE "public"."connector_app_mappings" 
    ADD CONSTRAINT "connector_app_mappings_connector_id_source_app_key" 
    UNIQUE USING INDEX "connector_app_mappings_connector_id_source_app_key";

-- Create trigger for updated_at
CREATE TRIGGER "update_connector_app_mappings_updated_at"
    BEFORE UPDATE ON "public"."connector_app_mappings"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Grant permissions
GRANT DELETE ON TABLE "public"."connector_app_mappings" TO "anon";
GRANT INSERT ON TABLE "public"."connector_app_mappings" TO "anon";
GRANT REFERENCES ON TABLE "public"."connector_app_mappings" TO "anon";
GRANT SELECT ON TABLE "public"."connector_app_mappings" TO "anon";
GRANT TRIGGER ON TABLE "public"."connector_app_mappings" TO "anon";
GRANT TRUNCATE ON TABLE "public"."connector_app_mappings" TO "anon";
GRANT UPDATE ON TABLE "public"."connector_app_mappings" TO "anon";

GRANT DELETE ON TABLE "public"."connector_app_mappings" TO "authenticated";
GRANT INSERT ON TABLE "public"."connector_app_mappings" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."connector_app_mappings" TO "authenticated";
GRANT SELECT ON TABLE "public"."connector_app_mappings" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."connector_app_mappings" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."connector_app_mappings" TO "authenticated";
GRANT UPDATE ON TABLE "public"."connector_app_mappings" TO "authenticated";

GRANT DELETE ON TABLE "public"."connector_app_mappings" TO "service_role";
GRANT INSERT ON TABLE "public"."connector_app_mappings" TO "service_role";
GRANT REFERENCES ON TABLE "public"."connector_app_mappings" TO "service_role";
GRANT SELECT ON TABLE "public"."connector_app_mappings" TO "service_role";
GRANT TRIGGER ON TABLE "public"."connector_app_mappings" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."connector_app_mappings" TO "service_role";
GRANT UPDATE ON TABLE "public"."connector_app_mappings" TO "service_role";

-- Create RLS policies for connector_app_mappings
-- Policy for authenticated users to access their tenant's connector app mappings
CREATE POLICY "Users can access connector app mappings for their tenant" ON "public"."connector_app_mappings"
    FOR ALL USING (
        "connector_id" IN (
            SELECT "id" FROM "connectors" 
            WHERE "tenant_id" IN (
                SELECT "tenant_id" FROM "user_tenants" 
                WHERE "user_id" = auth.uid() AND "status" = 'active'
            )
        )
    );

-- Policy for service role to access all connector app mappings
CREATE POLICY "Service role can access all connector app mappings" ON "public"."connector_app_mappings"
    FOR ALL USING (true);

-- Drop the old app_mappings table and its constraints
-- First drop foreign key constraints
ALTER TABLE "public"."app_mappings" DROP CONSTRAINT IF EXISTS "app_mappings_connector_id_fkey";
ALTER TABLE "public"."app_mappings" DROP CONSTRAINT IF EXISTS "app_mappings_connector_id_service_feature_key";

-- Drop primary key constraint first
ALTER TABLE "public"."app_mappings" DROP CONSTRAINT IF EXISTS "app_mappings_pkey";

-- Drop indexes
DROP INDEX IF EXISTS "public"."app_mappings_connector_id_service_feature_key";
DROP INDEX IF EXISTS "public"."app_mappings_pkey";
DROP INDEX IF EXISTS "public"."idx_app_mappings_connector";
DROP INDEX IF EXISTS "public"."idx_app_mappings_kintone_app_code";
DROP INDEX IF EXISTS "public"."idx_app_mappings_kintone_app_id";

-- Drop the old table
DROP TABLE "public"."app_mappings";

-- Add comments to explain the new structure
COMMENT ON TABLE "public"."connector_app_mappings" IS 'Mappings between source and target applications for connectors';
COMMENT ON COLUMN "public"."connector_app_mappings"."source_app_id" IS 'Source application identifier (e.g., Kintone app ID like "13")';
COMMENT ON COLUMN "public"."connector_app_mappings"."source_app_name" IS 'Source application name (e.g., Kintone app name like "就労_就労管理")';
COMMENT ON COLUMN "public"."connector_app_mappings"."target_app_type" IS 'Target application type (e.g., people, visas, meetings)';
COMMENT ON COLUMN "public"."connector_app_mappings"."is_active" IS 'Whether this mapping is currently active';
