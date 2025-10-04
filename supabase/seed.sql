SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict RoESS4dGN3OfZNu1nFEwqm7dIrXv3tlUQBDYy1rUhafUn0zQAWBshiugOPlawED

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
	('00000000-0000-0000-0000-000000000000', '949be304-535d-45b9-9bb3-5555e07a985c', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2025-10-04 11:55:12.980237+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8e655bd3-a6fd-430e-8301-d6e842d997e6', 'authenticated', 'authenticated', 'tomoaki.nishimura@funtoco.jp', '$2a$10$e0Gu/gitGrBm2g3BCWCy0OPc2mBKYX55ftJU6CXMsuaQgZbnHijsS', '2025-10-04 11:55:12.491398+00', NULL, '', '2025-10-04 11:55:02.636605+00', '', NULL, '', '', NULL, '2025-10-04 11:55:12.981147+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email": "tomoaki.nishimura@funtoco.jp", "tenant_id": "1c5a22c7-ca7c-4db7-9509-d91aff15aee0", "tenant_name": "柏原マルタマフーズ株式会社", "email_verified": true, "phone_verified": false}', NULL, '2025-10-04 11:55:02.625646+00', '2025-10-04 11:55:12.984312+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('8e655bd3-a6fd-430e-8301-d6e842d997e6', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '{"sub": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email": "tomoaki.nishimura@funtoco.jp", "tenant_name": "柏原マルタマフーズ株式会社", "email_verified": true, "phone_verified": false}', 'email', '2025-10-04 11:55:02.632545+00', '2025-10-04 11:55:02.632577+00', '2025-10-04 11:55:02.632577+00', 'fccac7f4-81af-4ad2-9658-2a8710ef0cdd');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id") VALUES
	('ab70a677-b613-422d-af08-eb5d1d4e4249', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '2025-10-04 11:55:12.981216+00', '2025-10-04 11:55:12.981216+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '172.18.0.1', NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ab70a677-b613-422d-af08-eb5d1d4e4249', '2025-10-04 11:55:12.984724+00', '2025-10-04 11:55:12.984724+00', 'email/signup', 'd0da480b-145c-408d-8b76-ea4f14ff9452');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'poqejd5bbf2q', '8e655bd3-a6fd-430e-8301-d6e842d997e6', false, '2025-10-04 11:55:12.982547+00', '2025-10-04 11:55:12.982547+00', NULL, 'ab70a677-b613-422d-af08-eb5d1d4e4249');


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

INSERT INTO "public"."connectors" ("id", "tenant_id", "provider", "display_name", "created_at", "updated_at") VALUES
	('8d9843b7-c150-4fd3-817e-b1e70bc37cc9', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'kintone', 'Kintone (funtoco)', '2025-10-04 11:55:31.216263+00', '2025-10-04 11:55:31.216263+00');


--
-- Data for Name: connection_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connection_status" ("id", "connector_id", "status", "last_error", "updated_at") VALUES
	('6a2b5e6f-d51d-46db-ac64-0a84f23de4c1', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', 'connected', NULL, '2025-10-04 11:55:49.425+00');


--
-- Data for Name: connector_app_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_app_mappings" ("id", "connector_id", "source_app_id", "source_app_name", "target_app_type", "is_active", "created_at", "updated_at") VALUES
	('40938e5f-db8f-4332-9479-dd667cf9c2ca', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', '13', 'Kintone app 13', 'people', true, '2025-10-04 12:03:49.882951+00', '2025-10-04 12:04:00.561564+00');


--
-- Data for Name: connector_app_filters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_app_filters" ("id", "connector_id", "app_mapping_id", "field_code", "field_name", "field_type", "filter_value", "is_active", "created_at", "updated_at") VALUES
	('fcb3958b-16d3-44fb-8c4a-196a8015875c', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', '40938e5f-db8f-4332-9479-dd667cf9c2ca', 'COID', '法人ID', 'NUMBER', '2787', true, '2025-10-04 12:03:50.808882+00', '2025-10-04 12:03:50.808882+00');


--
-- Data for Name: connector_field_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_field_mappings" ("id", "connector_id", "app_mapping_id", "source_field_id", "source_field_code", "source_field_name", "source_field_type", "target_field_id", "target_field_code", "target_field_name", "target_field_type", "is_required", "is_active", "sort_order", "created_at", "updated_at", "is_update_key") VALUES
	('160b3b1e-5fab-4cf6-9611-5428c02dd09b', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', '40938e5f-db8f-4332-9479-dd667cf9c2ca', '$id', '$id', '$id', 'UNKNOWN', 'id', 'id', NULL, NULL, false, true, 0, '2025-10-04 12:03:50.335767+00', '2025-10-04 12:03:50.335767+00', true),
	('0fbfb0e6-74b9-4d44-a82c-d024eeafad90', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', '40938e5f-db8f-4332-9479-dd667cf9c2ca', 'name', 'name', '人材名', 'SINGLE_LINE_TEXT', 'name', 'name', NULL, NULL, false, true, 1, '2025-10-04 12:03:50.335767+00', '2025-10-04 12:03:50.335767+00', false),
	('fd15e318-2ae8-445e-ab0a-68c1645c05a5', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', '40938e5f-db8f-4332-9479-dd667cf9c2ca', 'HRID', 'HRID', '人材ID', 'NUMBER', 'external_id', 'external_id', NULL, NULL, false, true, 2, '2025-10-04 12:03:50.335767+00', '2025-10-04 12:03:50.335767+00', false);


--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."credentials" ("id", "connector_id", "type", "payload_encrypted", "created_at", "updated_at", "format", "payload") VALUES
	('fd6cbfa6-0377-499e-b352-61fb1fefb5df', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', 'kintone_config', NULL, '2025-10-04 11:55:31.223007+00', '2025-10-04 11:55:31.223007+00', 'plain', '{"domain":"https://funtoco.cybozu.com","clientId":"l.1.sjxcgeg6zxdo1i267m57ss4r8gzti2go","clientSecret":"max0pn4pwxxhun6rh7z76dv7360ai7dkz9fqg9nu07l9tk7n55z7jntnk4ko5alw","scope":["k:app_record:read","k:app_settings:read"]}'),
	('ab185526-247b-48eb-984f-e65650b7e59d', '8d9843b7-c150-4fd3-817e-b1e70bc37cc9', 'kintone_token', NULL, '2025-10-04 11:55:49.23351+00', '2025-10-04 12:03:12.636+00', NULL, '{"access_token":"1.rM9-Js4Cc7NKPeAxp0b9WaorIFUFWdfypkWveb3re5VY685-","refresh_token":"1.Q3M23kEf2_HT8_SlqNJfB5CeWOvscyJJ3nqUwCzxIQVRGNjV","expires_at":1759582992632,"scope":"k:app_record:read k:app_settings:read"}');


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenants" ("id", "name", "slug", "description", "settings", "max_members", "created_at", "updated_at") VALUES
	('1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '柏原マルタマフーズ株式会社', '', '柏原マルタマフーズ株式会社のテナント', '{}', 50, '2025-10-04 11:55:03.238967+00', '2025-10-04 11:55:03.238967+00');


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
-- Data for Name: sync_item_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_tenants" ("id", "user_id", "tenant_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "email") VALUES
	('f81dd2b1-39b1-4c77-acbb-2c32f5a04d96', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'owner', 'active', NULL, NULL, NULL, '2025-10-04 11:55:03.250454+00', '2025-10-04 11:55:03.250454+00', 'tomoaki.nishimura@funtoco.jp');


--
-- Data for Name: visas; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


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

-- \unrestrict RoESS4dGN3OfZNu1nFEwqm7dIrXv3tlUQBDYy1rUhafUn0zQAWBshiugOPlawED

RESET ALL;
