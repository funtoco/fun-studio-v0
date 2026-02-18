create function combine_tenant_with_connector(company_name text, company_id text)
returns text
language plpgsql
as
$$
declare
    tenant_id uuid;
    connector_id uuid;
begin 
    tenant_id := create_tenant(
        combine_tenant_with_connector.company_name, 
        combine_tenant_with_connector.company_id, 
        combine_tenant_with_connector.company_name
    );

    if tenant_id is null then
        raise exception 'Failed to create tenant for company: %', combine_tenant_with_connector.company_name;
    end if;

    select create_connector
    into connector_id
    from create_connector(tenant_id, 'kintone', combine_tenant_with_connector.company_name, combine_tenant_with_connector.company_id);

    return tenant_id;
end
$$