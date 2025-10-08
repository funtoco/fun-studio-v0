-- Insert visas status mapping data
-- One-time data insertion for field_value_mappings

-- 書類準備中
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '営業_企業情報待ち', '書類準備中', true, 0, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '新規_企業情報待ち', '書類準備中', true, 1, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '既存_企業情報待ち', '書類準備中', true, 2, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '支援_更新案内・人材情報更新待ち', '書類準備中', true, 3, now(), now());

-- 書類作成中
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'OP_企業書類作成中', '書類作成中', true, 0, now(), now());

-- 書類確認中
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '営業_企業に確認してください', '書類確認中', true, 0, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '新規_企業に確認してください', '書類確認中', true, 1, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '既存_企業に確認してください', '書類確認中', true, 2, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'OP_企業に確認してください', '書類確認中', true, 3, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '新規_企業_書類確認待ち', '書類確認中', true, 4, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '既存_企業_書類確認待ち', '書類確認中', true, 5, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '企業_書類確認待ち（新規）', '書類確認中', true, 6, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '企業_書類確認待ち（更新）', '書類確認中', true, 7, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'OP_書類修正中', '書類確認中', true, 8, now(), now());

-- 申請準備中
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'OP_押印書類送付準備中', '申請準備中', true, 0, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'OP_押印書類受取待ち', '申請準備中', true, 1, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'OP_申請人サイン書類準備中', '申請準備中', true, 2, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '支援_申請人サイン待ち', '申請準備中', true, 3, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'OP_申請人サイン書類受取待ち', '申請準備中', true, 4, now(), now());

-- ビザ申請準備中
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'ビザ申請準備中', 'ビザ申請準備中', true, 0, now(), now()),
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', 'ビザ申請待ち', 'ビザ申請準備中', true, 1, now(), now());

-- 申請中
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '申請中', '申請中', true, 0, now(), now());

-- (追加書類)
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '追加修正対応中', '(追加書類)', true, 0, now(), now());

-- ビザ取得済み
INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
) VALUES 
  (gen_random_uuid(), '85919603-14f7-4ca5-9a1e-d013dab26342', '許可', 'ビザ取得済み', true, 0, now(), now());
