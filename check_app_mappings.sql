-- Check existing app mappings
SELECT 
  am.id,
  am.source_app_id,
  am.source_app_name,
  am.target_app_type,
  am.is_active,
  c.provider,
  c.display_name as connector_name
FROM "public"."connector_app_mappings" am
JOIN "public"."connectors" c ON am.connector_id = c.id
ORDER BY am.created_at DESC;

-- Check if there are any visas app mappings
SELECT 
  COUNT(*) as visas_mappings_count
FROM "public"."connector_app_mappings" am
JOIN "public"."connectors" c ON am.connector_id = c.id
WHERE am.target_app_type = 'visas';
