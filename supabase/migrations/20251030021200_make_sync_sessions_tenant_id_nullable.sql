-- Allow tenantless sync sessions

ALTER TABLE "public"."sync_sessions"
ALTER COLUMN "tenant_id" DROP NOT NULL;

COMMENT ON COLUMN "public"."sync_sessions"."tenant_id" IS 'Nullable. Null when connector is not bound to a tenant.';

