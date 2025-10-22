SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict F7SERS8Ns7W3N2nNkI9tafaZz3RhgES4MRGg6b0iMbISVdAYrUOaQCgXorJmsDc

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '1e44f1fe-5f21-483a-82a1-7b7e83066b2d', '{"action":"user_confirmation_requested","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-04 11:55:02.634821+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa44d494-aab4-49e6-a3e4-f061327c4fad', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"tomoaki.nishimura@funtoco.jp","user_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","user_phone":""}}', '2025-10-04 11:55:03.265657+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a331a892-0523-4fcb-b5c9-2323bec524ae', '{"action":"user_signedup","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-04 11:55:12.490635+00', ''),
	('00000000-0000-0000-0000-000000000000', '949be304-535d-45b9-9bb3-5555e07a985c', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2025-10-04 11:55:12.980237+00', ''),
	('00000000-0000-0000-0000-000000000000', '062bc4ec-63e5-4ede-88bc-4992d560fbad', '{"action":"token_refreshed","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"token"}', '2025-10-04 23:37:49.372664+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7d34d08-0174-49a9-8f0f-1f45f10c34df', '{"action":"token_revoked","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"token"}', '2025-10-04 23:37:49.37375+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c7bfded-8528-4edf-807e-ce34462d0582', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-05 00:56:41.017457+00', ''),
	('00000000-0000-0000-0000-000000000000', '75f6e5fc-74c3-4d3b-97f4-f19262f00c37', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-05 06:45:02.53671+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e658fbc1-a8af-417a-adca-dfe68b6af077', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-06 07:51:39.371444+00', ''),
	('00000000-0000-0000-0000-000000000000', '44749398-1fec-40f1-b093-48aeca21431d', '{"action":"user_modified","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"user"}', '2025-10-06 07:52:02.636795+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb9bff1c-d33b-4653-a60b-9df87cc7d3b4', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-17 03:04:52.947599+00', ''),
	('00000000-0000-0000-0000-000000000000', '56e15513-4a13-4373-8eba-7a0fd71e0d3f', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"raffi@funtoco.jp","user_id":"ffa61251-d7a9-4044-92ae-bf0f65caeb4c"}}', '2025-10-17 03:07:34.24577+00', ''),
	('00000000-0000-0000-0000-000000000000', '065ebfd0-c1b8-4dbe-bdd8-a990e989f445', '{"action":"user_signedup","actor_id":"ffa61251-d7a9-4044-92ae-bf0f65caeb4c","actor_username":"raffi@funtoco.jp","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-17 03:07:42.441007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a14daf52-6940-422f-acfb-83d921f79050', '{"action":"user_updated_password","actor_id":"ffa61251-d7a9-4044-92ae-bf0f65caeb4c","actor_username":"raffi@funtoco.jp","actor_via_sso":false,"log_type":"user"}', '2025-10-17 03:07:55.488869+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf5c950b-6985-4be9-ad3b-87308f0d954d', '{"action":"user_modified","actor_id":"ffa61251-d7a9-4044-92ae-bf0f65caeb4c","actor_username":"raffi@funtoco.jp","actor_via_sso":false,"log_type":"user"}', '2025-10-17 03:07:55.48926+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a6c81ec-2cda-4e14-8b4e-d7f83dba8629', '{"action":"logout","actor_id":"ffa61251-d7a9-4044-92ae-bf0f65caeb4c","actor_username":"raffi@funtoco.jp","actor_via_sso":false,"log_type":"account"}', '2025-10-17 03:08:13.217661+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b81e6d50-8660-4b64-9e08-dea508c08cd7', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-17 03:08:18.333672+00', ''),
	('00000000-0000-0000-0000-000000000000', '236b7d14-c6f5-45bb-8482-31c8ac55065a', '{"action":"token_refreshed","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"token"}', '2025-10-20 01:30:27.072756+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d2cbe4f-e2e2-442f-81ea-ec6c00ef0574', '{"action":"token_revoked","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"token"}', '2025-10-20 01:30:27.073605+00', ''),
	('00000000-0000-0000-0000-000000000000', '63b45d29-3b1d-4ffa-b3b3-765f8309a687', '{"action":"logout","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:30:35.81326+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fce8b7db-fe27-464e-bf3a-bfc99ecdf393', '{"action":"login","actor_id":"ffa61251-d7a9-4044-92ae-bf0f65caeb4c","actor_username":"raffi@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:30:44.334269+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8e655bd3-a6fd-430e-8301-d6e842d997e6', 'authenticated', 'authenticated', 'tomoaki.nishimura@funtoco.jp', '$2a$10$e0Gu/gitGrBm2g3BCWCy0OPc2mBKYX55ftJU6CXMsuaQgZbnHijsS', '2025-10-04 11:55:12.491398+00', NULL, '', '2025-10-04 11:55:02.636605+00', '', NULL, '', '', NULL, '2025-10-17 03:08:18.334294+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email": "tomoaki.nishimura@funtoco.jp", "tenant_id": "2eca3362-a925-455c-8542-35698084eabb", "tenant_name": "滋賀マルタマフーズ株式会社", "email_verified": true, "phone_verified": false}', NULL, '2025-10-04 11:55:02.625646+00', '2025-10-20 01:30:27.074965+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ffa61251-d7a9-4044-92ae-bf0f65caeb4c', 'authenticated', 'authenticated', 'raffi@funtoco.jp', '$2a$10$nbDU14XJJIx0huHRhsShB.Ny7UhnbhgcVcNY6CqQ9CZtsPIvRZ.Ry', '2025-10-17 03:07:42.441256+00', '2025-10-17 03:07:34.246592+00', '', NULL, '', NULL, '', '', NULL, '2025-10-20 01:30:44.334632+00', '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "tenant_id": "1c5a22c7-ca7c-4db7-9509-d91aff15aee0", "invited_by": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email_verified": true}', NULL, '2025-10-17 03:07:34.238859+00', '2025-10-20 01:30:44.336494+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('8e655bd3-a6fd-430e-8301-d6e842d997e6', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '{"sub": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email": "tomoaki.nishimura@funtoco.jp", "tenant_name": "柏原マルタマフーズ株式会社", "email_verified": true, "phone_verified": false}', 'email', '2025-10-04 11:55:02.632545+00', '2025-10-04 11:55:02.632577+00', '2025-10-04 11:55:02.632577+00', 'fccac7f4-81af-4ad2-9658-2a8710ef0cdd'),
	('ffa61251-d7a9-4044-92ae-bf0f65caeb4c', 'ffa61251-d7a9-4044-92ae-bf0f65caeb4c', '{"sub": "ffa61251-d7a9-4044-92ae-bf0f65caeb4c", "email": "raffi@funtoco.jp", "email_verified": true, "phone_verified": false}', 'email', '2025-10-17 03:07:34.244692+00', '2025-10-17 03:07:34.244733+00', '2025-10-17 03:07:34.244733+00', '3dc541de-657a-4053-8d5d-50937f2ddb8b');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('b2cca2d5-79e3-4211-9783-60fdb43c1db2', '2025-10-20 01:30:44.336608+00', '2025-10-20 01:30:44.336608+00', 'password', '2fe8dbea-a782-4a59-bbba-a07a48e4188c');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 10, 'i4yeyf7ehdha', 'ffa61251-d7a9-4044-92ae-bf0f65caeb4c', false, '2025-10-20 01:30:44.336135+00', '2025-10-20 01:30:44.336135+00', NULL, 'b2cca2d5-79e3-4211-9783-60fdb43c1db2');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: connectors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: connection_status; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: connector_app_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: connector_app_filters; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: connector_field_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: data_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: field_value_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: people; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: meetings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: meeting_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: support_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: sync_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: visas; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('people-images', 'people-images', NULL, '2025-10-05 05:20:03.309241+00', '2025-10-05 05:20:03.309241+00', false, false, 10485760, '{image/png,image/jpeg,image/jpg,image/gif,image/webp}', NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 10, true);


--
-- Name: meeting_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."meeting_notes_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict F7SERS8Ns7W3N2nNkI9tafaZz3RhgES4MRGg6b0iMbISVdAYrUOaQCgXorJmsDc

RESET ALL;
