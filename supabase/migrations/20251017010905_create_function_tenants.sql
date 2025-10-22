create or replace function create_tenant(name text, slug text, description text)
returns uuid
language plpgsql
as $$
declare
    new_id uuid;
begin
    insert into tenants(name, slug, description, created_at, updated_at)
    values (create_tenant.name, create_tenant.slug, create_tenant.description, now(), now())
    returning id into new_id;

    insert into user_tenants(user_id, tenant_id, role, status, email) values 
        ('40effd49-899e-4581-bbab-a8a7037c2d28', new_id, 'admin', 'active','raffi@funtoco.jp'),
        ('8e655bd3-a6fd-430e-8301-d6e842d997e6', new_id, 'owner', 'active','tomoaki.nashimura@funtoco.jp');
    
    return new_id;
end;
$$;

