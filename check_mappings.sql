-- Check data mappings
SELECT 
  dm.id,
  dm.field_name,
  dm.field_type,
  dm.is_active,
  am.source_app_name,
  am.target_app_type
FROM "public"."data_mappings" dm
JOIN "public"."connector_app_mappings" am ON dm.app_mapping_id = am.id
WHERE dm.field_name = 'status';

-- Check value mappings for status
SELECT 
  fvm.source_value,
  fvm.target_value,
  fvm.is_active,
  fvm.sort_order
FROM "public"."field_value_mappings" fvm
JOIN "public"."data_mappings" dm ON fvm.data_mapping_id = dm.id
WHERE dm.field_name = 'status'
ORDER BY fvm.target_value, fvm.sort_order;
