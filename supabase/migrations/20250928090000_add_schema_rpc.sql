-- Add RPC to fetch allowed public table columns for schema-driven mapping
create or replace function public.get_public_table_columns(p_table text)
returns table (
  column_name text,
  data_type text,
  is_nullable boolean,
  ordinal_position integer
) security definer
language plpgsql
as $$
begin
  if p_table not in ('people','visas','meetings') then
    raise exception 'table not allowed';
  end if;
  return query
  select
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean,
    c.ordinal_position::int
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = p_table
  order by c.ordinal_position;
end;
$$;

grant execute on function public.get_public_table_columns(text) to authenticated, service_role;


