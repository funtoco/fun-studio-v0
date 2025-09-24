-- Apps dari Kintone
create table if not exists public.kintone_apps (
  id uuid primary key default gen_random_uuid(),
  connector_id uuid not null references public.connectors(id) on delete cascade,
  app_id bigint not null,
  name text not null,
  code text,
  space_id bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (connector_id, app_id)
);

-- Fields per app
create table if not exists public.kintone_fields (
  id uuid primary key default gen_random_uuid(),
  kintone_app_id uuid not null references public.kintone_apps(id) on delete cascade,
  field_code text not null,
  label text,
  type text,
  required boolean,
  meta jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (kintone_app_id, field_code)
);

-- Add connector_id column to kintone_fields if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'kintone_fields' AND column_name = 'connector_id') THEN
        ALTER TABLE public.kintone_fields ADD COLUMN connector_id uuid;
        ALTER TABLE public.kintone_fields ADD CONSTRAINT kintone_fields_connector_id_fkey 
            FOREIGN KEY (connector_id) REFERENCES public.connectors(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add app_id column to kintone_fields if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'kintone_fields' AND column_name = 'app_id') THEN
        ALTER TABLE public.kintone_fields ADD COLUMN app_id bigint;
    END IF;
END $$;

-- Mapping app per service feature
create table if not exists public.app_mappings (
  id uuid primary key default gen_random_uuid(),
  connector_id uuid not null references public.connectors(id) on delete cascade,
  service_feature text not null,  -- e.g. "people","orders"
  app_id bigint not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (connector_id, service_feature)
);

-- Mapping field
create table if not exists public.field_mappings (
  id uuid primary key default gen_random_uuid(),
  mapping_id uuid not null references public.app_mappings(id) on delete cascade,
  service_field text not null,
  kintone_field_code text not null,
  transform text,                 -- optional: "string|number|date|custom"
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (mapping_id, service_field)
);

-- Records hasil sync
create table if not exists public.kintone_records (
  id uuid primary key default gen_random_uuid(),
  connector_id uuid not null references public.connectors(id) on delete cascade,
  app_id bigint not null,
  record_id bigint not null,           -- Kintone $id
  revision bigint,                     -- Kintone $revision
  payload jsonb not null,              -- record normalized sesuai mapping
  synced_at timestamptz default now(),
  unique (connector_id, app_id, record_id)
);

-- Add indexes for better performance
create index if not exists idx_kintone_apps_connector_id on public.kintone_apps(connector_id);
create index if not exists idx_kintone_fields_connector_app on public.kintone_fields(connector_id, app_id);
create index if not exists idx_app_mappings_connector on public.app_mappings(connector_id);
create index if not exists idx_field_mappings_mapping_id on public.field_mappings(mapping_id);
create index if not exists idx_kintone_records_connector_app on public.kintone_records(connector_id, app_id);
create index if not exists idx_kintone_records_synced_at on public.kintone_records(synced_at);

-- Enable RLS
alter table public.kintone_apps enable row level security;
alter table public.kintone_fields enable row level security;
alter table public.app_mappings enable row level security;
alter table public.field_mappings enable row level security;
alter table public.kintone_records enable row level security;

-- Create policies (allow all for now, can be restricted later)
create policy "Allow all operations on kintone_apps" on public.kintone_apps for all using (true);
create policy "Allow all operations on kintone_fields" on public.kintone_fields for all using (true);
create policy "Allow all operations on app_mappings" on public.app_mappings for all using (true);
create policy "Allow all operations on field_mappings" on public.field_mappings for all using (true);
create policy "Allow all operations on kintone_records" on public.kintone_records for all using (true);
