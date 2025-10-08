-- Seed visas status mapping data
-- This migration creates sample data mappings and value mappings for visas status field

-- First, we need to find an existing app mapping for visas
-- We'll create a data mapping for the status field and then populate value mappings

-- Create data mapping for visas status field (assuming there's an app mapping for visas)
-- Note: This assumes there's already an app mapping for visas in connector_app_mappings
-- If not, you'll need to create one first

-- Insert data mapping for status field
INSERT INTO "public"."data_mappings" (
  "id",
  "app_mapping_id",
  "field_name",
  "field_type",
  "is_active",
  "created_at",
  "updated_at"
)
SELECT 
  gen_random_uuid(),
  am.id,
  'status',
  'string',
  true,
  now(),
  now()
FROM "public"."connector_app_mappings" am
JOIN "public"."connectors" c ON am.connector_id = c.id
WHERE am.target_app_type = 'visas'
  AND c.provider = 'kintone'
  AND NOT EXISTS (
    SELECT 1 FROM "public"."data_mappings" dm 
    WHERE dm.app_mapping_id = am.id 
    AND dm.field_name = 'status'
  )
LIMIT 1;

-- Now insert the value mappings for the status field
-- We'll use the data mapping we just created

INSERT INTO "public"."field_value_mappings" (
  "id",
  "data_mapping_id",
  "source_value",
  "target_value",
  "is_active",
  "sort_order",
  "created_at",
  "updated_at"
)
SELECT 
  gen_random_uuid(),
  dm.id,
  source_value,
  target_value,
  true,
  sort_order,
  now(),
  now()
FROM "public"."data_mappings" dm
JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
JOIN "public"."connectors" c ON am.connector_id = c.id
CROSS JOIN (
  -- 書類準備中
  SELECT '営業_企業情報待ち' as source_value, '書類準備中' as target_value, 0 as sort_order
  UNION ALL SELECT '新規_企業情報待ち', '書類準備中', 1
  UNION ALL SELECT '既存_企業情報待ち', '書類準備中', 2
  UNION ALL SELECT '支援_更新案内・人材情報更新待ち', '書類準備中', 3
  
  -- 書類作成中
  UNION ALL SELECT 'OP_企業書類作成中', '書類作成中', 0
  
  -- 書類確認中
  UNION ALL SELECT '営業_企業に確認してください', '書類確認中', 0
  UNION ALL SELECT '新規_企業に確認してください', '書類確認中', 1
  UNION ALL SELECT '既存_企業に確認してください', '書類確認中', 2
  UNION ALL SELECT 'OP_企業に確認してください', '書類確認中', 3
  UNION ALL SELECT '新規_企業_書類確認待ち', '書類確認中', 4
  UNION ALL SELECT '既存_企業_書類確認待ち', '書類確認中', 5
  UNION ALL SELECT '企業_書類確認待ち（新規）', '書類確認中', 6
  UNION ALL SELECT '企業_書類確認待ち（更新）', '書類確認中', 7
  UNION ALL SELECT 'OP_書類修正中', '書類確認中', 8
  
  -- 申請準備中
  UNION ALL SELECT 'OP_押印書類送付準備中', '申請準備中', 0
  UNION ALL SELECT 'OP_押印書類受取待ち', '申請準備中', 1
  UNION ALL SELECT 'OP_申請人サイン書類準備中', '申請準備中', 2
  UNION ALL SELECT '支援_申請人サイン待ち', '申請準備中', 3
  UNION ALL SELECT 'OP_申請人サイン書類受取待ち', '申請準備中', 4
  
  -- ビザ申請準備中
  UNION ALL SELECT 'ビザ申請準備中', 'ビザ申請準備中', 0
  UNION ALL SELECT 'ビザ申請待ち', 'ビザ申請準備中', 1
  
  -- 申請中
  UNION ALL SELECT '申請中', '申請中', 0
  
  -- (追加書類)
  UNION ALL SELECT '追加修正対応中', '(追加書類)', 0
  
  -- ビザ取得済み
  UNION ALL SELECT '許可', 'ビザ取得済み', 0
) AS status_mappings
WHERE dm.field_name = 'status'
  AND am.target_app_type = 'visas'
  AND c.provider = 'kintone'
  AND NOT EXISTS (
    SELECT 1 FROM "public"."field_value_mappings" fvm 
    WHERE fvm.data_mapping_id = dm.id 
    AND fvm.source_value = status_mappings.source_value
  );

-- Add comments for documentation
COMMENT ON TABLE "public"."data_mappings" IS 'Stores data mapping configurations for each app mapping';
COMMENT ON TABLE "public"."field_value_mappings" IS 'Stores value mapping rules between Kintone and service fields';

-- Log the results
DO $$
DECLARE
  data_mapping_count INTEGER;
  value_mapping_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO data_mapping_count 
  FROM "public"."data_mappings" dm
  JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
  WHERE am.target_app_type = 'visas' AND dm.field_name = 'status';
  
  SELECT COUNT(*) INTO value_mapping_count 
  FROM "public"."field_value_mappings" fvm
  JOIN "public"."data_mappings" dm ON fvm.data_mapping_id = dm.id
  JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
  WHERE am.target_app_type = 'visas' AND dm.field_name = 'status';
  
  RAISE NOTICE 'Created % data mapping(s) for visas status field', data_mapping_count;
  RAISE NOTICE 'Created % value mapping(s) for visas status field', value_mapping_count;
END $$;
