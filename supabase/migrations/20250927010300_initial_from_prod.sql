create sequence "public"."meeting_notes_id_seq";

create table "public"."app_mappings" (
    "id" uuid not null default gen_random_uuid(),
    "connector_id" uuid not null,
    "service_feature" text not null,
    "app_id" bigint not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "kintone_app_id" text,
    "kintone_app_code" text,
    "kintone_app_name" text
);


alter table "public"."app_mappings" enable row level security;

create table "public"."connection_status" (
    "id" uuid not null default gen_random_uuid(),
    "connector_id" uuid not null,
    "status" text not null default 'disconnected'::text,
    "last_error" text,
    "updated_at" timestamp with time zone default now()
);


alter table "public"."connection_status" enable row level security;

create table "public"."connectors" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "provider" text not null,
    "display_name" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."connectors" enable row level security;

create table "public"."credentials" (
    "id" uuid not null default gen_random_uuid(),
    "connector_id" uuid not null,
    "type" text not null,
    "payload_encrypted" bytea,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "format" text,
    "payload" text
);


alter table "public"."credentials" enable row level security;

create table "public"."meeting_notes" (
    "id" integer not null default nextval('meeting_notes_id_seq'::regclass),
    "meeting_id" text not null,
    "section" text not null,
    "item" text not null,
    "level" text,
    "detail" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."meeting_notes" enable row level security;

create table "public"."meetings" (
    "id" text not null,
    "person_id" text not null,
    "kind" text not null,
    "title" text not null,
    "datetime" timestamp with time zone not null,
    "duration_min" integer,
    "attendees" text[],
    "created_by" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."meetings" enable row level security;

create table "public"."people" (
    "id" text not null,
    "name" text not null,
    "kana" text,
    "nationality" text,
    "dob" date,
    "phone" text,
    "email" text,
    "address" text,
    "company" text,
    "note" text,
    "visa_id" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "employee_number" text,
    "working_status" text,
    "specific_skill_field" text,
    "residence_card_no" text,
    "residence_card_expiry_date" date,
    "residence_card_issued_date" date
);


alter table "public"."people" enable row level security;

create table "public"."support_actions" (
    "id" text not null,
    "person_id" text not null,
    "category" text not null,
    "title" text not null,
    "detail" text,
    "status" text not null,
    "assignee" text,
    "due_date" date,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."support_actions" enable row level security;

create table "public"."sync_item_logs" (
    "id" uuid not null default gen_random_uuid(),
    "session_id" uuid not null,
    "item_type" text not null,
    "item_id" text not null,
    "status" text not null,
    "timestamp" timestamp with time zone not null default now(),
    "error_details" text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."sync_item_logs" enable row level security;

create table "public"."sync_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "connector_id" uuid,
    "sync_type" text not null,
    "status" text not null default 'running'::text,
    "start_time" timestamp with time zone not null default now(),
    "end_time" timestamp with time zone,
    "total_count" integer default 0,
    "success_count" integer default 0,
    "failed_count" integer default 0,
    "error_message" text,
    "run_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."sync_sessions" enable row level security;

create table "public"."tenants" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "slug" text not null,
    "description" text,
    "settings" jsonb default '{}'::jsonb,
    "max_members" integer default 10,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."user_tenants" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "tenant_id" uuid not null,
    "role" text not null default 'member'::text,
    "status" text not null default 'active'::text,
    "invited_by" uuid,
    "invited_at" timestamp with time zone,
    "joined_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "email" text not null
);


alter table "public"."user_tenants" enable row level security;

create table "public"."visas" (
    "id" text not null,
    "person_id" text not null,
    "status" text not null,
    "type" text not null,
    "expiry_date" date,
    "submitted_at" timestamp with time zone,
    "result_at" timestamp with time zone,
    "manager" text,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."visas" enable row level security;

alter sequence "public"."meeting_notes_id_seq" owned by "public"."meeting_notes"."id";

CREATE UNIQUE INDEX app_mappings_connector_id_service_feature_key ON public.app_mappings USING btree (connector_id, service_feature);

CREATE UNIQUE INDEX app_mappings_pkey ON public.app_mappings USING btree (id);

CREATE UNIQUE INDEX connection_status_connector_id_unique ON public.connection_status USING btree (connector_id);

CREATE UNIQUE INDEX connection_status_pkey ON public.connection_status USING btree (id);

CREATE UNIQUE INDEX connectors_pkey ON public.connectors USING btree (id);

CREATE UNIQUE INDEX credentials_pkey ON public.credentials USING btree (id);

CREATE INDEX idx_app_mappings_connector ON public.app_mappings USING btree (connector_id);

CREATE INDEX idx_app_mappings_kintone_app_code ON public.app_mappings USING btree (kintone_app_code);

CREATE INDEX idx_app_mappings_kintone_app_id ON public.app_mappings USING btree (kintone_app_id);

CREATE INDEX idx_connection_status_connector ON public.connection_status USING btree (connector_id);

CREATE INDEX idx_connectors_tenant_provider ON public.connectors USING btree (tenant_id, provider);

CREATE INDEX idx_credentials_connector_type ON public.credentials USING btree (connector_id, type);

CREATE INDEX idx_credentials_format ON public.credentials USING btree (format);

CREATE INDEX idx_credentials_payload ON public.credentials USING btree (payload);

CREATE INDEX idx_meeting_notes_meeting_id ON public.meeting_notes USING btree (meeting_id);

CREATE INDEX idx_meetings_created_at ON public.meetings USING btree (created_at);

CREATE INDEX idx_meetings_datetime ON public.meetings USING btree (datetime);

CREATE INDEX idx_meetings_kind ON public.meetings USING btree (kind);

CREATE INDEX idx_meetings_person_id ON public.meetings USING btree (person_id);

CREATE INDEX idx_people_created_at ON public.people USING btree (created_at);

CREATE INDEX idx_people_employee_number ON public.people USING btree (employee_number);

CREATE INDEX idx_people_nationality ON public.people USING btree (nationality);

CREATE INDEX idx_people_residence_card_expiry ON public.people USING btree (residence_card_expiry_date);

CREATE INDEX idx_people_visa_id ON public.people USING btree (visa_id);

CREATE INDEX idx_people_working_status ON public.people USING btree (working_status);

CREATE INDEX idx_support_actions_assignee ON public.support_actions USING btree (assignee);

CREATE INDEX idx_support_actions_category ON public.support_actions USING btree (category);

CREATE INDEX idx_support_actions_created_at ON public.support_actions USING btree (created_at);

CREATE INDEX idx_support_actions_due_date ON public.support_actions USING btree (due_date);

CREATE INDEX idx_support_actions_person_id ON public.support_actions USING btree (person_id);

CREATE INDEX idx_support_actions_status ON public.support_actions USING btree (status);

CREATE INDEX idx_sync_item_logs_session ON public.sync_item_logs USING btree (session_id);

CREATE INDEX idx_sync_item_logs_status ON public.sync_item_logs USING btree (status);

CREATE INDEX idx_sync_item_logs_timestamp ON public.sync_item_logs USING btree ("timestamp");

CREATE INDEX idx_sync_item_logs_type ON public.sync_item_logs USING btree (item_type);

CREATE INDEX idx_sync_sessions_connector ON public.sync_sessions USING btree (connector_id);

CREATE INDEX idx_sync_sessions_start_time ON public.sync_sessions USING btree (start_time);

CREATE INDEX idx_sync_sessions_status ON public.sync_sessions USING btree (status);

CREATE INDEX idx_sync_sessions_tenant ON public.sync_sessions USING btree (tenant_id);

CREATE INDEX idx_sync_sessions_type ON public.sync_sessions USING btree (sync_type);

CREATE INDEX idx_tenants_slug ON public.tenants USING btree (slug);

CREATE INDEX idx_user_tenants_email ON public.user_tenants USING btree (email);

CREATE INDEX idx_user_tenants_role ON public.user_tenants USING btree (role);

CREATE INDEX idx_user_tenants_status ON public.user_tenants USING btree (status);

CREATE INDEX idx_user_tenants_tenant_id ON public.user_tenants USING btree (tenant_id);

CREATE INDEX idx_user_tenants_user_id ON public.user_tenants USING btree (user_id);

CREATE INDEX idx_visas_expiry_date ON public.visas USING btree (expiry_date);

CREATE INDEX idx_visas_person_id ON public.visas USING btree (person_id);

CREATE INDEX idx_visas_status ON public.visas USING btree (status);

CREATE INDEX idx_visas_type ON public.visas USING btree (type);

CREATE INDEX idx_visas_updated_at ON public.visas USING btree (updated_at);

CREATE UNIQUE INDEX meeting_notes_pkey ON public.meeting_notes USING btree (id);

CREATE UNIQUE INDEX meetings_pkey ON public.meetings USING btree (id);

CREATE UNIQUE INDEX people_pkey ON public.people USING btree (id);

CREATE UNIQUE INDEX support_actions_pkey ON public.support_actions USING btree (id);

CREATE UNIQUE INDEX sync_item_logs_pkey ON public.sync_item_logs USING btree (id);

CREATE UNIQUE INDEX sync_sessions_pkey ON public.sync_sessions USING btree (id);

CREATE UNIQUE INDEX tenants_pkey ON public.tenants USING btree (id);

CREATE UNIQUE INDEX tenants_slug_key ON public.tenants USING btree (slug);

CREATE UNIQUE INDEX user_tenants_pkey ON public.user_tenants USING btree (id);

CREATE UNIQUE INDEX user_tenants_user_tenant_unique ON public.user_tenants USING btree (user_id, tenant_id);

CREATE UNIQUE INDEX visas_pkey ON public.visas USING btree (id);

alter table "public"."app_mappings" add constraint "app_mappings_pkey" PRIMARY KEY using index "app_mappings_pkey";

alter table "public"."connection_status" add constraint "connection_status_pkey" PRIMARY KEY using index "connection_status_pkey";

alter table "public"."connectors" add constraint "connectors_pkey" PRIMARY KEY using index "connectors_pkey";

alter table "public"."credentials" add constraint "credentials_pkey" PRIMARY KEY using index "credentials_pkey";

alter table "public"."meeting_notes" add constraint "meeting_notes_pkey" PRIMARY KEY using index "meeting_notes_pkey";

alter table "public"."meetings" add constraint "meetings_pkey" PRIMARY KEY using index "meetings_pkey";

alter table "public"."people" add constraint "people_pkey" PRIMARY KEY using index "people_pkey";

alter table "public"."support_actions" add constraint "support_actions_pkey" PRIMARY KEY using index "support_actions_pkey";

alter table "public"."sync_item_logs" add constraint "sync_item_logs_pkey" PRIMARY KEY using index "sync_item_logs_pkey";

alter table "public"."sync_sessions" add constraint "sync_sessions_pkey" PRIMARY KEY using index "sync_sessions_pkey";

alter table "public"."tenants" add constraint "tenants_pkey" PRIMARY KEY using index "tenants_pkey";

alter table "public"."user_tenants" add constraint "user_tenants_pkey" PRIMARY KEY using index "user_tenants_pkey";

alter table "public"."visas" add constraint "visas_pkey" PRIMARY KEY using index "visas_pkey";

alter table "public"."app_mappings" add constraint "app_mappings_connector_id_fkey" FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE not valid;

alter table "public"."app_mappings" validate constraint "app_mappings_connector_id_fkey";

alter table "public"."app_mappings" add constraint "app_mappings_connector_id_service_feature_key" UNIQUE using index "app_mappings_connector_id_service_feature_key";

alter table "public"."connection_status" add constraint "connection_status_connector_id_fkey" FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE not valid;

alter table "public"."connection_status" validate constraint "connection_status_connector_id_fkey";

alter table "public"."connection_status" add constraint "connection_status_connector_id_unique" UNIQUE using index "connection_status_connector_id_unique";

alter table "public"."credentials" add constraint "credentials_connector_id_fkey" FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE not valid;

alter table "public"."credentials" validate constraint "credentials_connector_id_fkey";

alter table "public"."meeting_notes" add constraint "meeting_notes_level_check" CHECK ((level = ANY (ARRAY['大'::text, '中'::text, '小'::text]))) not valid;

alter table "public"."meeting_notes" validate constraint "meeting_notes_level_check";

alter table "public"."meeting_notes" add constraint "meeting_notes_meeting_id_fkey" FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE not valid;

alter table "public"."meeting_notes" validate constraint "meeting_notes_meeting_id_fkey";

alter table "public"."meetings" add constraint "meetings_kind_check" CHECK ((kind = ANY (ARRAY['仕事'::text, 'プライベート'::text]))) not valid;

alter table "public"."meetings" validate constraint "meetings_kind_check";

alter table "public"."meetings" add constraint "meetings_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE not valid;

alter table "public"."meetings" validate constraint "meetings_person_id_fkey";

alter table "public"."support_actions" add constraint "support_actions_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE not valid;

alter table "public"."support_actions" validate constraint "support_actions_person_id_fkey";

alter table "public"."support_actions" add constraint "support_actions_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'done'::text]))) not valid;

alter table "public"."support_actions" validate constraint "support_actions_status_check";

alter table "public"."sync_item_logs" add constraint "sync_item_logs_item_type_check" CHECK ((item_type = ANY (ARRAY['people'::text, 'visa'::text]))) not valid;

alter table "public"."sync_item_logs" validate constraint "sync_item_logs_item_type_check";

alter table "public"."sync_item_logs" add constraint "sync_item_logs_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sync_sessions(id) ON DELETE CASCADE not valid;

alter table "public"."sync_item_logs" validate constraint "sync_item_logs_session_id_fkey";

alter table "public"."sync_item_logs" add constraint "sync_item_logs_status_check" CHECK ((status = ANY (ARRAY['success'::text, 'failed'::text]))) not valid;

alter table "public"."sync_item_logs" validate constraint "sync_item_logs_status_check";

alter table "public"."sync_sessions" add constraint "sync_sessions_connector_id_fkey" FOREIGN KEY (connector_id) REFERENCES connectors(id) ON DELETE CASCADE not valid;

alter table "public"."sync_sessions" validate constraint "sync_sessions_connector_id_fkey";

alter table "public"."sync_sessions" add constraint "sync_sessions_run_by_fkey" FOREIGN KEY (run_by) REFERENCES auth.users(id) not valid;

alter table "public"."sync_sessions" validate constraint "sync_sessions_run_by_fkey";

alter table "public"."sync_sessions" add constraint "sync_sessions_status_check" CHECK ((status = ANY (ARRAY['running'::text, 'success'::text, 'failed'::text]))) not valid;

alter table "public"."sync_sessions" validate constraint "sync_sessions_status_check";

alter table "public"."sync_sessions" add constraint "sync_sessions_sync_type_check" CHECK ((sync_type = ANY (ARRAY['manual'::text, 'scheduled'::text]))) not valid;

alter table "public"."sync_sessions" validate constraint "sync_sessions_sync_type_check";

alter table "public"."tenants" add constraint "tenants_slug_key" UNIQUE using index "tenants_slug_key";

alter table "public"."user_tenants" add constraint "user_tenants_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES auth.users(id) not valid;

alter table "public"."user_tenants" validate constraint "user_tenants_invited_by_fkey";

alter table "public"."user_tenants" add constraint "user_tenants_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'guest'::text]))) not valid;

alter table "public"."user_tenants" validate constraint "user_tenants_role_check";

alter table "public"."user_tenants" add constraint "user_tenants_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'pending'::text, 'suspended'::text]))) not valid;

alter table "public"."user_tenants" validate constraint "user_tenants_status_check";

alter table "public"."user_tenants" add constraint "user_tenants_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE not valid;

alter table "public"."user_tenants" validate constraint "user_tenants_tenant_id_fkey";

alter table "public"."user_tenants" add constraint "user_tenants_user_tenant_unique" UNIQUE using index "user_tenants_user_tenant_unique" DEFERRABLE INITIALLY DEFERRED;

alter table "public"."visas" add constraint "visas_person_id_fkey" FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE not valid;

alter table "public"."visas" validate constraint "visas_person_id_fkey";

alter table "public"."visas" add constraint "visas_status_check" CHECK ((status = ANY (ARRAY['書類準備中'::text, '書類作成中'::text, '書類確認中'::text, '申請準備中'::text, 'ビザ申請準備中'::text, '申請中'::text, 'ビザ取得済み'::text]))) not valid;

alter table "public"."visas" validate constraint "visas_status_check";

alter table "public"."visas" add constraint "visas_type_check" CHECK ((type = ANY (ARRAY['認定申請'::text, '変更申請'::text, '更新申請'::text, '特定活動申請'::text, '資格変更（特定技能2号）'::text]))) not valid;

alter table "public"."visas" validate constraint "visas_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.activate_user_tenant_membership()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- When a user signs up or signs in, check if they have pending tenant memberships
  -- This will be called from the application when needed
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_old_sync_logs()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Delete sync sessions older than 30 days
  DELETE FROM sync_sessions 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Delete item logs for deleted sessions (cascade should handle this, but just in case)
  DELETE FROM sync_item_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_meetings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_support_actions_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_sync_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_tenant_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_visas_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."app_mappings" to "anon";

grant insert on table "public"."app_mappings" to "anon";

grant references on table "public"."app_mappings" to "anon";

grant select on table "public"."app_mappings" to "anon";

grant trigger on table "public"."app_mappings" to "anon";

grant truncate on table "public"."app_mappings" to "anon";

grant update on table "public"."app_mappings" to "anon";

grant delete on table "public"."app_mappings" to "authenticated";

grant insert on table "public"."app_mappings" to "authenticated";

grant references on table "public"."app_mappings" to "authenticated";

grant select on table "public"."app_mappings" to "authenticated";

grant trigger on table "public"."app_mappings" to "authenticated";

grant truncate on table "public"."app_mappings" to "authenticated";

grant update on table "public"."app_mappings" to "authenticated";

grant delete on table "public"."app_mappings" to "service_role";

grant insert on table "public"."app_mappings" to "service_role";

grant references on table "public"."app_mappings" to "service_role";

grant select on table "public"."app_mappings" to "service_role";

grant trigger on table "public"."app_mappings" to "service_role";

grant truncate on table "public"."app_mappings" to "service_role";

grant update on table "public"."app_mappings" to "service_role";

grant delete on table "public"."connection_status" to "anon";

grant insert on table "public"."connection_status" to "anon";

grant references on table "public"."connection_status" to "anon";

grant select on table "public"."connection_status" to "anon";

grant trigger on table "public"."connection_status" to "anon";

grant truncate on table "public"."connection_status" to "anon";

grant update on table "public"."connection_status" to "anon";

grant delete on table "public"."connection_status" to "authenticated";

grant insert on table "public"."connection_status" to "authenticated";

grant references on table "public"."connection_status" to "authenticated";

grant select on table "public"."connection_status" to "authenticated";

grant trigger on table "public"."connection_status" to "authenticated";

grant truncate on table "public"."connection_status" to "authenticated";

grant update on table "public"."connection_status" to "authenticated";

grant delete on table "public"."connection_status" to "service_role";

grant insert on table "public"."connection_status" to "service_role";

grant references on table "public"."connection_status" to "service_role";

grant select on table "public"."connection_status" to "service_role";

grant trigger on table "public"."connection_status" to "service_role";

grant truncate on table "public"."connection_status" to "service_role";

grant update on table "public"."connection_status" to "service_role";

grant delete on table "public"."connectors" to "anon";

grant insert on table "public"."connectors" to "anon";

grant references on table "public"."connectors" to "anon";

grant select on table "public"."connectors" to "anon";

grant trigger on table "public"."connectors" to "anon";

grant truncate on table "public"."connectors" to "anon";

grant update on table "public"."connectors" to "anon";

grant delete on table "public"."connectors" to "authenticated";

grant insert on table "public"."connectors" to "authenticated";

grant references on table "public"."connectors" to "authenticated";

grant select on table "public"."connectors" to "authenticated";

grant trigger on table "public"."connectors" to "authenticated";

grant truncate on table "public"."connectors" to "authenticated";

grant update on table "public"."connectors" to "authenticated";

grant delete on table "public"."connectors" to "service_role";

grant insert on table "public"."connectors" to "service_role";

grant references on table "public"."connectors" to "service_role";

grant select on table "public"."connectors" to "service_role";

grant trigger on table "public"."connectors" to "service_role";

grant truncate on table "public"."connectors" to "service_role";

grant update on table "public"."connectors" to "service_role";

grant delete on table "public"."credentials" to "anon";

grant insert on table "public"."credentials" to "anon";

grant references on table "public"."credentials" to "anon";

grant select on table "public"."credentials" to "anon";

grant trigger on table "public"."credentials" to "anon";

grant truncate on table "public"."credentials" to "anon";

grant update on table "public"."credentials" to "anon";

grant delete on table "public"."credentials" to "authenticated";

grant insert on table "public"."credentials" to "authenticated";

grant references on table "public"."credentials" to "authenticated";

grant select on table "public"."credentials" to "authenticated";

grant trigger on table "public"."credentials" to "authenticated";

grant truncate on table "public"."credentials" to "authenticated";

grant update on table "public"."credentials" to "authenticated";

grant delete on table "public"."credentials" to "service_role";

grant insert on table "public"."credentials" to "service_role";

grant references on table "public"."credentials" to "service_role";

grant select on table "public"."credentials" to "service_role";

grant trigger on table "public"."credentials" to "service_role";

grant truncate on table "public"."credentials" to "service_role";

grant update on table "public"."credentials" to "service_role";

grant delete on table "public"."meeting_notes" to "anon";

grant insert on table "public"."meeting_notes" to "anon";

grant references on table "public"."meeting_notes" to "anon";

grant select on table "public"."meeting_notes" to "anon";

grant trigger on table "public"."meeting_notes" to "anon";

grant truncate on table "public"."meeting_notes" to "anon";

grant update on table "public"."meeting_notes" to "anon";

grant delete on table "public"."meeting_notes" to "authenticated";

grant insert on table "public"."meeting_notes" to "authenticated";

grant references on table "public"."meeting_notes" to "authenticated";

grant select on table "public"."meeting_notes" to "authenticated";

grant trigger on table "public"."meeting_notes" to "authenticated";

grant truncate on table "public"."meeting_notes" to "authenticated";

grant update on table "public"."meeting_notes" to "authenticated";

grant delete on table "public"."meeting_notes" to "service_role";

grant insert on table "public"."meeting_notes" to "service_role";

grant references on table "public"."meeting_notes" to "service_role";

grant select on table "public"."meeting_notes" to "service_role";

grant trigger on table "public"."meeting_notes" to "service_role";

grant truncate on table "public"."meeting_notes" to "service_role";

grant update on table "public"."meeting_notes" to "service_role";

grant delete on table "public"."meetings" to "anon";

grant insert on table "public"."meetings" to "anon";

grant references on table "public"."meetings" to "anon";

grant select on table "public"."meetings" to "anon";

grant trigger on table "public"."meetings" to "anon";

grant truncate on table "public"."meetings" to "anon";

grant update on table "public"."meetings" to "anon";

grant delete on table "public"."meetings" to "authenticated";

grant insert on table "public"."meetings" to "authenticated";

grant references on table "public"."meetings" to "authenticated";

grant select on table "public"."meetings" to "authenticated";

grant trigger on table "public"."meetings" to "authenticated";

grant truncate on table "public"."meetings" to "authenticated";

grant update on table "public"."meetings" to "authenticated";

grant delete on table "public"."meetings" to "service_role";

grant insert on table "public"."meetings" to "service_role";

grant references on table "public"."meetings" to "service_role";

grant select on table "public"."meetings" to "service_role";

grant trigger on table "public"."meetings" to "service_role";

grant truncate on table "public"."meetings" to "service_role";

grant update on table "public"."meetings" to "service_role";

grant delete on table "public"."people" to "anon";

grant insert on table "public"."people" to "anon";

grant references on table "public"."people" to "anon";

grant select on table "public"."people" to "anon";

grant trigger on table "public"."people" to "anon";

grant truncate on table "public"."people" to "anon";

grant update on table "public"."people" to "anon";

grant delete on table "public"."people" to "authenticated";

grant insert on table "public"."people" to "authenticated";

grant references on table "public"."people" to "authenticated";

grant select on table "public"."people" to "authenticated";

grant trigger on table "public"."people" to "authenticated";

grant truncate on table "public"."people" to "authenticated";

grant update on table "public"."people" to "authenticated";

grant delete on table "public"."people" to "service_role";

grant insert on table "public"."people" to "service_role";

grant references on table "public"."people" to "service_role";

grant select on table "public"."people" to "service_role";

grant trigger on table "public"."people" to "service_role";

grant truncate on table "public"."people" to "service_role";

grant update on table "public"."people" to "service_role";

grant delete on table "public"."support_actions" to "anon";

grant insert on table "public"."support_actions" to "anon";

grant references on table "public"."support_actions" to "anon";

grant select on table "public"."support_actions" to "anon";

grant trigger on table "public"."support_actions" to "anon";

grant truncate on table "public"."support_actions" to "anon";

grant update on table "public"."support_actions" to "anon";

grant delete on table "public"."support_actions" to "authenticated";

grant insert on table "public"."support_actions" to "authenticated";

grant references on table "public"."support_actions" to "authenticated";

grant select on table "public"."support_actions" to "authenticated";

grant trigger on table "public"."support_actions" to "authenticated";

grant truncate on table "public"."support_actions" to "authenticated";

grant update on table "public"."support_actions" to "authenticated";

grant delete on table "public"."support_actions" to "service_role";

grant insert on table "public"."support_actions" to "service_role";

grant references on table "public"."support_actions" to "service_role";

grant select on table "public"."support_actions" to "service_role";

grant trigger on table "public"."support_actions" to "service_role";

grant truncate on table "public"."support_actions" to "service_role";

grant update on table "public"."support_actions" to "service_role";

grant delete on table "public"."sync_item_logs" to "anon";

grant insert on table "public"."sync_item_logs" to "anon";

grant references on table "public"."sync_item_logs" to "anon";

grant select on table "public"."sync_item_logs" to "anon";

grant trigger on table "public"."sync_item_logs" to "anon";

grant truncate on table "public"."sync_item_logs" to "anon";

grant update on table "public"."sync_item_logs" to "anon";

grant delete on table "public"."sync_item_logs" to "authenticated";

grant insert on table "public"."sync_item_logs" to "authenticated";

grant references on table "public"."sync_item_logs" to "authenticated";

grant select on table "public"."sync_item_logs" to "authenticated";

grant trigger on table "public"."sync_item_logs" to "authenticated";

grant truncate on table "public"."sync_item_logs" to "authenticated";

grant update on table "public"."sync_item_logs" to "authenticated";

grant delete on table "public"."sync_item_logs" to "service_role";

grant insert on table "public"."sync_item_logs" to "service_role";

grant references on table "public"."sync_item_logs" to "service_role";

grant select on table "public"."sync_item_logs" to "service_role";

grant trigger on table "public"."sync_item_logs" to "service_role";

grant truncate on table "public"."sync_item_logs" to "service_role";

grant update on table "public"."sync_item_logs" to "service_role";

grant delete on table "public"."sync_sessions" to "anon";

grant insert on table "public"."sync_sessions" to "anon";

grant references on table "public"."sync_sessions" to "anon";

grant select on table "public"."sync_sessions" to "anon";

grant trigger on table "public"."sync_sessions" to "anon";

grant truncate on table "public"."sync_sessions" to "anon";

grant update on table "public"."sync_sessions" to "anon";

grant delete on table "public"."sync_sessions" to "authenticated";

grant insert on table "public"."sync_sessions" to "authenticated";

grant references on table "public"."sync_sessions" to "authenticated";

grant select on table "public"."sync_sessions" to "authenticated";

grant trigger on table "public"."sync_sessions" to "authenticated";

grant truncate on table "public"."sync_sessions" to "authenticated";

grant update on table "public"."sync_sessions" to "authenticated";

grant delete on table "public"."sync_sessions" to "service_role";

grant insert on table "public"."sync_sessions" to "service_role";

grant references on table "public"."sync_sessions" to "service_role";

grant select on table "public"."sync_sessions" to "service_role";

grant trigger on table "public"."sync_sessions" to "service_role";

grant truncate on table "public"."sync_sessions" to "service_role";

grant update on table "public"."sync_sessions" to "service_role";

grant delete on table "public"."tenants" to "anon";

grant insert on table "public"."tenants" to "anon";

grant references on table "public"."tenants" to "anon";

grant select on table "public"."tenants" to "anon";

grant trigger on table "public"."tenants" to "anon";

grant truncate on table "public"."tenants" to "anon";

grant update on table "public"."tenants" to "anon";

grant delete on table "public"."tenants" to "authenticated";

grant insert on table "public"."tenants" to "authenticated";

grant references on table "public"."tenants" to "authenticated";

grant select on table "public"."tenants" to "authenticated";

grant trigger on table "public"."tenants" to "authenticated";

grant truncate on table "public"."tenants" to "authenticated";

grant update on table "public"."tenants" to "authenticated";

grant delete on table "public"."tenants" to "service_role";

grant insert on table "public"."tenants" to "service_role";

grant references on table "public"."tenants" to "service_role";

grant select on table "public"."tenants" to "service_role";

grant trigger on table "public"."tenants" to "service_role";

grant truncate on table "public"."tenants" to "service_role";

grant update on table "public"."tenants" to "service_role";

grant delete on table "public"."user_tenants" to "anon";

grant insert on table "public"."user_tenants" to "anon";

grant references on table "public"."user_tenants" to "anon";

grant select on table "public"."user_tenants" to "anon";

grant trigger on table "public"."user_tenants" to "anon";

grant truncate on table "public"."user_tenants" to "anon";

grant update on table "public"."user_tenants" to "anon";

grant delete on table "public"."user_tenants" to "authenticated";

grant insert on table "public"."user_tenants" to "authenticated";

grant references on table "public"."user_tenants" to "authenticated";

grant select on table "public"."user_tenants" to "authenticated";

grant trigger on table "public"."user_tenants" to "authenticated";

grant truncate on table "public"."user_tenants" to "authenticated";

grant update on table "public"."user_tenants" to "authenticated";

grant delete on table "public"."user_tenants" to "service_role";

grant insert on table "public"."user_tenants" to "service_role";

grant references on table "public"."user_tenants" to "service_role";

grant select on table "public"."user_tenants" to "service_role";

grant trigger on table "public"."user_tenants" to "service_role";

grant truncate on table "public"."user_tenants" to "service_role";

grant update on table "public"."user_tenants" to "service_role";

grant delete on table "public"."visas" to "anon";

grant insert on table "public"."visas" to "anon";

grant references on table "public"."visas" to "anon";

grant select on table "public"."visas" to "anon";

grant trigger on table "public"."visas" to "anon";

grant truncate on table "public"."visas" to "anon";

grant update on table "public"."visas" to "anon";

grant delete on table "public"."visas" to "authenticated";

grant insert on table "public"."visas" to "authenticated";

grant references on table "public"."visas" to "authenticated";

grant select on table "public"."visas" to "authenticated";

grant trigger on table "public"."visas" to "authenticated";

grant truncate on table "public"."visas" to "authenticated";

grant update on table "public"."visas" to "authenticated";

grant delete on table "public"."visas" to "service_role";

grant insert on table "public"."visas" to "service_role";

grant references on table "public"."visas" to "service_role";

grant select on table "public"."visas" to "service_role";

grant trigger on table "public"."visas" to "service_role";

grant truncate on table "public"."visas" to "service_role";

grant update on table "public"."visas" to "service_role";

create policy "Allow all operations on app_mappings"
on "public"."app_mappings"
as permissive
for all
to public
using (true);


create policy "Allow public access on connection_status"
on "public"."connection_status"
as permissive
for all
to public
using (true);


create policy "Allow public access on connectors"
on "public"."connectors"
as permissive
for all
to public
using (true);


create policy "Allow public access on credentials"
on "public"."credentials"
as permissive
for all
to public
using (true);


create policy "Allow all operations for authenticated users"
on "public"."meeting_notes"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow all operations for authenticated users"
on "public"."meetings"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow all operations for authenticated users"
on "public"."people"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow public read access"
on "public"."people"
as permissive
for select
to public
using (true);


create policy "Allow all operations for authenticated users"
on "public"."support_actions"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text));


create policy "Users can create item logs for their tenant sessions"
on "public"."sync_item_logs"
as permissive
for insert
to public
with check ((session_id IN ( SELECT sync_sessions.id
   FROM sync_sessions
  WHERE (sync_sessions.tenant_id IN ( SELECT user_tenants.tenant_id
           FROM user_tenants
          WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.status = 'active'::text)))))));


create policy "Users can view item logs for their tenant sessions"
on "public"."sync_item_logs"
as permissive
for select
to public
using ((session_id IN ( SELECT sync_sessions.id
   FROM sync_sessions
  WHERE (sync_sessions.tenant_id IN ( SELECT user_tenants.tenant_id
           FROM user_tenants
          WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.status = 'active'::text)))))));


create policy "Users can create sync sessions for their tenants"
on "public"."sync_sessions"
as permissive
for insert
to public
with check ((tenant_id IN ( SELECT user_tenants.tenant_id
   FROM user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.status = 'active'::text)))));


create policy "Users can update sync sessions for their tenants"
on "public"."sync_sessions"
as permissive
for update
to public
using ((tenant_id IN ( SELECT user_tenants.tenant_id
   FROM user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.status = 'active'::text)))));


create policy "Users can view sync sessions for their tenants"
on "public"."sync_sessions"
as permissive
for select
to public
using ((tenant_id IN ( SELECT user_tenants.tenant_id
   FROM user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.status = 'active'::text)))));


create policy "Tenant owners and admins can update their tenant"
on "public"."tenants"
as permissive
for update
to public
using ((id IN ( SELECT user_tenants.tenant_id
   FROM user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.status = 'active'::text) AND (user_tenants.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


create policy "Users can view tenants they belong to"
on "public"."tenants"
as permissive
for select
to public
using ((id IN ( SELECT user_tenants.tenant_id
   FROM user_tenants
  WHERE ((user_tenants.user_id = auth.uid()) AND (user_tenants.status = 'active'::text)))));


create policy "Enable insert for authenticated users only"
on "public"."user_tenants"
as permissive
for insert
to authenticated
with check (true);


create policy "Policy with security definer functions"
on "public"."user_tenants"
as permissive
for all
to public
using ((tenant_id = ((((auth.jwt() ->> 'user_metadata'::text))::jsonb ->> 'tenant_id'::text))::uuid));


create policy "Users can delete their own memberships"
on "public"."user_tenants"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Users can update their own memberships"
on "public"."user_tenants"
as permissive
for update
to public
using ((tenant_id = ((((auth.jwt() ->> 'user_metadata'::text))::jsonb ->> 'tenant_id'::text))::uuid));


create policy "Users can view tenant members"
on "public"."user_tenants"
as permissive
for select
to public
using ((tenant_id = ((((auth.jwt() ->> 'user_metadata'::text))::jsonb ->> 'tenant_id'::text))::uuid));


create policy "Allow all operations for authenticated users"
on "public"."visas"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow public read access"
on "public"."visas"
as permissive
for select
to public
using (true);


CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION update_meetings_updated_at();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON public.people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_actions_updated_at BEFORE UPDATE ON public.support_actions FOR EACH ROW EXECUTE FUNCTION update_support_actions_updated_at();

CREATE TRIGGER update_sync_sessions_updated_at BEFORE UPDATE ON public.sync_sessions FOR EACH ROW EXECUTE FUNCTION update_sync_updated_at();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION update_tenant_updated_at();

CREATE TRIGGER update_user_tenants_updated_at BEFORE UPDATE ON public.user_tenants FOR EACH ROW EXECUTE FUNCTION update_tenant_updated_at();

CREATE TRIGGER update_visas_updated_at BEFORE UPDATE ON public.visas FOR EACH ROW EXECUTE FUNCTION update_visas_updated_at();