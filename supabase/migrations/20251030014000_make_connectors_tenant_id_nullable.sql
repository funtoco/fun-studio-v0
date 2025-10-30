-- Allow connectors without a tenant by making tenant_id nullable

ALTER TABLE "public"."connectors"
ALTER COLUMN "tenant_id" DROP NOT NULL;

COMMENT ON COLUMN "public"."connectors"."tenant_id" IS 'Nullable. When NULL, connector is not bound to a specific tenant.';

