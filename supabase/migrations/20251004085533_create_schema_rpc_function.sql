-- Create RPC function for getting table columns (improved version)
CREATE OR REPLACE FUNCTION public.get_table_columns_raw(p_table text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean,
  ordinal_position integer
) SECURITY DEFINER
LANGUAGE sql
VOLATILE
SET search_path = public, extensions
AS $$
  SELECT
    a.attname::text as column_name,
    pg_catalog.format_type(a.atttypid, a.atttypmod)::text as data_type,
    NOT a.attnotnull as is_nullable,
    a.attnum::int as ordinal_position
  FROM pg_catalog.pg_attribute a
  JOIN pg_catalog.pg_class c ON a.attrelid = c.oid
  JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'public'
    AND c.relname = p_table
    AND a.attnum > 0
    AND NOT a.attisdropped
  ORDER BY a.attnum;
$$;

-- Grant permissions
REVOKE ALL ON FUNCTION public.get_table_columns_raw(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_table_columns_raw(text) TO anon, authenticated, service_role;
