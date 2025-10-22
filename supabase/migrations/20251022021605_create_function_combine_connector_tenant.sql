create function combine_tenant_with_connector(company_name text, company_id text)
returns text
language plpgsql
as
$$
declare
    tenant_id uuid;
    connector_id uuid;
begin 
    select create_tenant
    into tenant_id
    from create_tenant(combine_tenant_with_connector.company_name, combine_tenant_with_connector.company_id, combine_tenant_with_connector.company_name);

    select create_connector
    into connector_id
    from create_connector(tenant_id, 'kintone', combine_tenant_with_connector.company_name, combine_tenant_with_connector.company_id);

    return tenant_id;
end
$$