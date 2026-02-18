create or replace function create_tenant(name text, slug text, description text, owner_id uuid default null)
returns uuid
language plpgsql
security definer
as $$
declare
    new_id uuid;
    actual_owner_id uuid;
begin
    -- Determine the owner ID: use provided, then auth.uid()
    actual_owner_id := coalesce(owner_id, auth.uid());
    
    insert into tenants(name, slug, description, created_at, updated_at)
    values (create_tenant.name, create_tenant.slug, create_tenant.description, now(), now())
    returning id into new_id;

    if actual_owner_id is not null then
        insert into user_tenants(user_id, tenant_id, role, status, email) 
        select 
            actual_owner_id, 
            new_id, 
            'owner', 
            'active',
            coalesce(email, 'owner@funtoco.jp')
        from auth.users where id = actual_owner_id;
    end if;
    
    return new_id;
exception when others then
    raise log 'Error in create_tenant: %', sqlerrm;
    return null;
end;
$$;

