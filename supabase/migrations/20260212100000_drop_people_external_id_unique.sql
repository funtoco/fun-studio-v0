-- Allow duplicate external_id on people (one 人材ID can have multiple 就労管理ID rows).
-- external_id = 人材ID is used to link to 人材マスター (e.g. photo sync); multiple people rows
-- can share the same 人材ID.

DROP INDEX IF EXISTS "public"."idx_people_external_id_unique";

COMMENT ON COLUMN "public"."people"."external_id" IS 'External system identifier (e.g. 人材ID from Kintone). Used to link to 人材マスター; multiple rows may share the same value when one person has multiple 就労管理ID.';
