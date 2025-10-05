SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 9oygkLY78fbJ72Atd3ZAWCFgWvNRh8OzWP4FG7jdLKFhMJfGpTS26WUuSaG3GCD

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
	('00000000-0000-0000-0000-000000000000', '75f6e5fc-74c3-4d3b-97f4-f19262f00c37', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-05 06:45:02.53671+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8e655bd3-a6fd-430e-8301-d6e842d997e6', 'authenticated', 'authenticated', 'tomoaki.nishimura@funtoco.jp', '$2a$10$e0Gu/gitGrBm2g3BCWCy0OPc2mBKYX55ftJU6CXMsuaQgZbnHijsS', '2025-10-04 11:55:12.491398+00', NULL, '', '2025-10-04 11:55:02.636605+00', '', NULL, '', '', NULL, '2025-10-05 06:45:02.538389+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email": "tomoaki.nishimura@funtoco.jp", "tenant_id": "1c5a22c7-ca7c-4db7-9509-d91aff15aee0", "tenant_name": "柏原マルタマフーズ株式会社", "email_verified": true, "phone_verified": false}', NULL, '2025-10-04 11:55:02.625646+00', '2025-10-05 06:45:02.541248+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('8e655bd3-a6fd-430e-8301-d6e842d997e6', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '{"sub": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email": "tomoaki.nishimura@funtoco.jp", "tenant_name": "柏原マルタマフーズ株式会社", "email_verified": true, "phone_verified": false}', 'email', '2025-10-04 11:55:02.632545+00', '2025-10-04 11:55:02.632577+00', '2025-10-04 11:55:02.632577+00', 'fccac7f4-81af-4ad2-9658-2a8710ef0cdd');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('ab70a677-b613-422d-af08-eb5d1d4e4249', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '2025-10-04 11:55:12.981216+00', '2025-10-04 23:37:49.377172+00', NULL, 'aal1', NULL, '2025-10-04 23:37:49.377127', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('a329eea5-3d39-4a61-86e1-fe6efd50daab', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '2025-10-05 00:56:41.018885+00', '2025-10-05 00:56:41.018885+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('7009db5c-9182-4526-b7c3-d350363c4ee0', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '2025-10-05 06:45:02.538484+00', '2025-10-05 06:45:02.538484+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ab70a677-b613-422d-af08-eb5d1d4e4249', '2025-10-04 11:55:12.984724+00', '2025-10-04 11:55:12.984724+00', 'email/signup', 'd0da480b-145c-408d-8b76-ea4f14ff9452'),
	('a329eea5-3d39-4a61-86e1-fe6efd50daab', '2025-10-05 00:56:41.023658+00', '2025-10-05 00:56:41.023658+00', 'password', '20aa6639-193c-4e88-bf84-462677cc9f85'),
	('7009db5c-9182-4526-b7c3-d350363c4ee0', '2025-10-05 06:45:02.541896+00', '2025-10-05 06:45:02.541896+00', 'password', '7a0b05fa-3934-4d49-a1d4-8001a44e2b85');


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
	('00000000-0000-0000-0000-000000000000', 1, 'poqejd5bbf2q', '8e655bd3-a6fd-430e-8301-d6e842d997e6', true, '2025-10-04 11:55:12.982547+00', '2025-10-04 23:37:49.374081+00', NULL, 'ab70a677-b613-422d-af08-eb5d1d4e4249'),
	('00000000-0000-0000-0000-000000000000', 2, 'd557xor37twa', '8e655bd3-a6fd-430e-8301-d6e842d997e6', false, '2025-10-04 23:37:49.375041+00', '2025-10-04 23:37:49.375041+00', 'poqejd5bbf2q', 'ab70a677-b613-422d-af08-eb5d1d4e4249'),
	('00000000-0000-0000-0000-000000000000', 3, 'qtwdmv2zydy6', '8e655bd3-a6fd-430e-8301-d6e842d997e6', false, '2025-10-05 00:56:41.020499+00', '2025-10-05 00:56:41.020499+00', NULL, 'a329eea5-3d39-4a61-86e1-fe6efd50daab'),
	('00000000-0000-0000-0000-000000000000', 4, 'gvfasryvr5xx', '8e655bd3-a6fd-430e-8301-d6e842d997e6', false, '2025-10-05 06:45:02.539656+00', '2025-10-05 06:45:02.539656+00', NULL, '7009db5c-9182-4526-b7c3-d350363c4ee0');


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
	('01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'kintone', 'Kintone (funtoco)', '2025-10-05 06:45:24.13713+00', '2025-10-05 06:45:24.13713+00');


--
-- Data for Name: connection_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connection_status" ("id", "connector_id", "status", "last_error", "updated_at") VALUES
	('8b0eb1d5-3ba0-45ce-ab11-8c671aabec80', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', 'connected', NULL, '2025-10-05 06:45:28.529+00');


--
-- Data for Name: connector_app_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_app_mappings" ("id", "connector_id", "source_app_id", "source_app_name", "target_app_type", "is_active", "created_at", "updated_at") VALUES
	('1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '13', 'Kintone app 13', 'people', true, '2025-10-05 06:47:37.74174+00', '2025-10-05 06:47:45.462378+00'),
	('072e9120-19a5-4fd4-8ef0-722a9d9cedc5', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '30', 'Kintone app 30', 'people', true, '2025-10-05 06:49:04.489284+00', '2025-10-05 06:49:10.688443+00');


--
-- Data for Name: connector_app_filters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_app_filters" ("id", "connector_id", "app_mapping_id", "field_code", "field_name", "field_type", "filter_value", "is_active", "created_at", "updated_at") VALUES
	('cf522fa1-95c6-4bf0-85b0-ea8ea89409d8', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'COID', '法人ID', 'NUMBER', '2787', true, '2025-10-05 06:47:38.791029+00', '2025-10-05 06:47:38.791029+00'),
	('bc297a6f-836e-4c23-89e8-65dfbd607a6b', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '072e9120-19a5-4fd4-8ef0-722a9d9cedc5', 'HRID', '人材ID', 'RECORD_NUMBER', '884', true, '2025-10-05 06:49:04.992907+00', '2025-10-05 06:49:04.992907+00');


--
-- Data for Name: connector_field_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_field_mappings" ("id", "connector_id", "app_mapping_id", "source_field_id", "source_field_code", "source_field_name", "source_field_type", "target_field_id", "target_field_code", "target_field_name", "target_field_type", "is_required", "is_active", "sort_order", "created_at", "updated_at", "is_update_key") VALUES
	('04cc6bef-388b-4c53-81a6-d4c9e38ca179', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', '$id', '$id', '$id', 'UNKNOWN', 'id', 'id', NULL, NULL, false, true, 0, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', true),
	('e86a7759-de49-457d-a546-739d270ecfe8', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'name', 'name', '人材名', 'SINGLE_LINE_TEXT', 'name', 'name', NULL, NULL, false, true, 1, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('f7264665-1239-4110-9b17-fe38476cb442', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'furigana', 'furigana', '呼び名（フリガナ）', 'SINGLE_LINE_TEXT', 'kana', 'kana', NULL, NULL, false, true, 2, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('d5c8783c-38c6-423d-8d64-2d080163e7f8', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'country', 'country', '国籍', 'DROP_DOWN', 'nationality', 'nationality', NULL, NULL, false, true, 3, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('7c6914a9-ec26-4741-ad0b-885e066f4800', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'dateOfBirth', 'dateOfBirth', '生年月日', 'DATE', 'dob', 'dob', NULL, NULL, false, true, 4, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('8d30b81a-010b-4f29-8b19-3a1ccce6352f', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'phoneNumber', 'phoneNumber', '電話番号', 'SINGLE_LINE_TEXT', 'phone', 'phone', NULL, NULL, false, true, 5, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('e4b33b65-9601-45ae-bf0e-3ada849f213f', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'address', 'address', '住所', 'SINGLE_LINE_TEXT', 'address', 'address', NULL, NULL, false, true, 6, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('7c7a2733-3034-4d0d-9986-6dcb17148213', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'workingStatus', 'workingStatus', '就労ステータス (営業のみ)', 'DROP_DOWN', 'working_status', 'working_status', NULL, NULL, false, true, 7, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('4d516bd0-016a-4092-b3fb-52704cd77bd9', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'latestResidenceCardNo', 'latestResidenceCardNo', '在留カード番号', 'SINGLE_LINE_TEXT', 'residence_card_no', 'residence_card_no', NULL, NULL, false, true, 8, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('c5c74c20-5173-4cff-a002-5f1a14cbce12', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'latestResidenceCardExpirationDate', 'latestResidenceCardExpirationDate', '在留期限', 'DATE', 'residence_card_issued_date', 'residence_card_issued_date', NULL, NULL, false, true, 9, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('9b4c96e9-b535-4041-a321-d9c4b4dfad95', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '1f91fd9b-37ea-4b3b-9f66-78a0d5d9b516', 'HRID', 'HRID', '人材ID', 'NUMBER', 'external_id', 'external_id', NULL, NULL, false, true, 10, '2025-10-05 06:47:38.464295+00', '2025-10-05 06:47:38.464295+00', false),
	('6b5a591a-91d8-49b7-a0ff-933983811777', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '072e9120-19a5-4fd4-8ef0-722a9d9cedc5', '$id', '$id', '$id', 'UNKNOWN', 'external_id', 'external_id', NULL, NULL, false, true, 0, '2025-10-05 06:49:04.780548+00', '2025-10-05 06:49:04.780548+00', true),
	('829a0c4f-f5d5-446f-9f47-df31b17c4f04', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', '072e9120-19a5-4fd4-8ef0-722a9d9cedc5', 'image', 'image', '写真 (営業 / CA)', 'FILE', 'image_path', 'image_path', NULL, NULL, false, true, 1, '2025-10-05 06:49:04.780548+00', '2025-10-05 06:49:04.780548+00', false);


--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."credentials" ("id", "connector_id", "type", "payload_encrypted", "created_at", "updated_at", "format", "payload") VALUES
	('a6e09afb-5a2f-4d65-8c8b-15568e924a4d', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', 'kintone_config', NULL, '2025-10-05 06:45:24.142782+00', '2025-10-05 06:45:24.142782+00', 'plain', '{"domain":"https://funtoco.cybozu.com","clientId":"l.1.sjxcgeg6zxdo1i267m57ss4r8gzti2go","clientSecret":"max0pn4pwxxhun6rh7z76dv7360ai7dkz9fqg9nu07l9tk7n55z7jntnk4ko5alw","scope":["k:app_record:read","k:app_settings:read"]}'),
	('af90e1ee-5ef7-49c8-a0ea-7f8b51f690c8', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', 'kintone_token', NULL, '2025-10-05 06:45:27.899137+00', '2025-10-05 06:45:35.406+00', NULL, '{"access_token":"1.XhQ5FjiG-BbCZjUMjMg6CFoyljObZedK_AFL-FVGc3k0mXJX","refresh_token":"1.Y8RnIXFE3aDEZUm4wD1yhm92q-V-oP9IqK7Lx-SdajbRgDae","expires_at":1759650335401,"scope":"k:app_record:read k:app_settings:read k:file:read"}');


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenants" ("id", "name", "slug", "description", "settings", "max_members", "created_at", "updated_at") VALUES
	('1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '柏原マルタマフーズ株式会社', '', '柏原マルタマフーズ株式会社のテナント', '{}', 50, '2025-10-04 11:55:03.238967+00', '2025-10-04 11:55:03.238967+00');


--
-- Data for Name: people; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."people" ("id", "name", "kana", "nationality", "dob", "phone", "email", "address", "company", "note", "visa_id", "created_at", "updated_at", "employee_number", "working_status", "specific_skill_field", "residence_card_no", "residence_card_expiry_date", "residence_card_issued_date", "tenant_id", "external_id", "image_path") VALUES
	('504', 'BHUJEL SURYA BAHADUR', 'スルヤ', 'ネパール', '2002-09-20', NULL, NULL, '和歌山県橋本市神野々877-1', NULL, NULL, NULL, '2025-10-05 06:47:48.122+00', '2025-10-05 06:47:47.50595+00', NULL, '退職', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '861', NULL),
	('506', 'BAL RUJIT', 'ルジト', 'ネパール', '1998-08-03', '080-7996-1962', NULL, '大阪府大阪狭山市東池尻5丁目1301番地の2-103号', NULL, NULL, NULL, '2025-10-05 06:47:48.162+00', '2025-10-05 06:47:47.540927+00', NULL, '在籍中', NULL, 'SA84060007LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '863', NULL),
	('507', 'TAMANG RAJU', 'ラズ', 'ネパール', '1993-11-20', '080-9427-5612', NULL, '大阪府堺市西区浜寺船尾町西5-5-2 レオパレス浜寺ドット輝106', NULL, NULL, NULL, '2025-10-05 06:47:48.171+00', '2025-10-05 06:47:47.549439+00', NULL, '在籍中', NULL, 'SAJ6121434LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '864', NULL),
	('508', 'THAPA DIPAK', 'ディパク', 'ネパール', '1992-02-07', '080-7370-6873', NULL, '大阪府大阪市住吉区長居東 1-14-22-201号', NULL, NULL, NULL, '2025-10-05 06:47:48.181+00', '2025-10-05 06:47:47.559707+00', NULL, '在籍中', NULL, 'SA53757228LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '865', NULL),
	('509', 'BHANDARI OBARAM', 'オバラム', 'ネパール', '1993-12-07', '080-7624-9113', NULL, '大阪府八尾市東山本新町2丁目6番10  レオパレス東山本 102', NULL, NULL, NULL, '2025-10-05 06:47:48.191+00', '2025-10-05 06:47:47.569573+00', NULL, '在籍中', NULL, 'SA13321720LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '866', NULL),
	('512', 'GAUCHAN ROSHAN', 'ロサン ', 'ネパール', '1993-05-05', NULL, NULL, '大阪府堺市東区草尾385-1 レオパレス登美丘105', NULL, NULL, NULL, '2025-10-05 06:47:48.223+00', '2025-10-05 06:47:47.60272+00', NULL, '在籍中', NULL, 'SA26935760LA', '2025-12-02', '2025-12-02', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '869', NULL),
	('514', 'ASHIM KHADKA', 'アシム', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:48.243+00', '2025-10-05 06:47:47.621744+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '871', NULL),
	('515', 'BIKRAN BASNET', 'ビクラン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:48.253+00', '2025-10-05 06:47:47.631339+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '872', NULL),
	('517', 'MAGAR SURESH', 'スレス', 'ネパール', '1995-08-21', '070-3357-7615', NULL, '大阪府大阪市平野区加美正覚寺３丁目７−２３レオパレスヴィヴレII  205', NULL, NULL, NULL, '2025-10-05 06:47:48.272+00', '2025-10-05 06:47:47.65113+00', NULL, '在籍中', NULL, 'SA78814312LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '874', NULL),
	('519', 'THING RAJ KUMAR', 'ラジ ', 'ネパール', '1991-11-12', '080-7949-5338', NULL, '大阪府門真市堂山町3-19-104号', NULL, NULL, NULL, '2025-10-05 06:47:48.292+00', '2025-10-05 06:47:47.670418+00', NULL, '在籍中', NULL, 'SA93788779LA', '2025-12-02', '2025-12-02', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '876', NULL),
	('522', 'GC DAMODAR', 'ダモダル', 'ネパール', '1987-01-06', '070-3192-2622', NULL, '奈良県葛城市西辻179-1 レスポワールC棟203', NULL, NULL, NULL, '2025-10-05 06:47:48.32+00', '2025-10-05 06:47:47.699316+00', NULL, '在籍中', NULL, 'UH02404443LA', '2026-11-22', '2026-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '879', NULL),
	('525', 'SHRESTHA DINESH', 'ディネス', 'ネパール', '1997-03-03', '080-4421-4674', NULL, '兵庫県西宮市甲子園口5丁目13番37−304号', NULL, NULL, NULL, '2025-10-05 06:47:48.347+00', '2025-10-05 06:47:47.725557+00', NULL, '在籍中', NULL, 'SA20649250LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '882', NULL),
	('1045', 'AUNG KO HTWE', 'アウン', 'ミャンマー', '2000-05-13', '090-5305-8926', NULL, '大阪府大東市北条1-6-1レオパレス野崎参道203', NULL, NULL, NULL, '2025-10-05 06:47:48.382+00', '2025-10-05 06:47:47.760021+00', NULL, '在籍中', NULL, 'UH83804573LA', '2026-04-16', '2026-04-16', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1099', NULL),
	('1048', 'AUNG SOE NAING', 'アウン', 'ミャンマー', '1996-07-07', '080-1156-9499', NULL, '大阪府門真市大倉町24-22レオパレスラフレシール302', NULL, NULL, NULL, '2025-10-05 06:47:48.398+00', '2025-10-05 06:47:47.775959+00', NULL, '在籍中', NULL, 'UH55263939LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1102', NULL),
	('1051', 'KYAW THURA', 'チョー', 'ミャンマー', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:48.417+00', '2025-10-05 06:47:47.795231+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1105', NULL),
	('1054', 'MYO MIN THANT', 'ミョー', 'ミャンマー', '2002-05-08', '080-9993-9579', NULL, '和歌山県新宮市五新5番10 メゾンなんかい2階建  203', NULL, NULL, NULL, '2025-10-05 06:47:48.438+00', '2025-10-05 06:47:47.816316+00', NULL, '在籍中', NULL, 'UH05364599LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1108', NULL),
	('1058', 'PHYO KHANT KYAW', 'ピョー', 'ミャンマー', '2004-04-10', '080-7848-5684', NULL, '奈良県御所市東辻33-11エスポワールA202号室', NULL, NULL, NULL, '2025-10-05 06:47:48.464+00', '2025-10-05 06:47:47.84222+00', NULL, '在籍中', NULL, 'UH68241793LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1112', NULL),
	('1064', 'ZAW MIN OO', 'ゾー', 'ミャンマー', '1998-06-10', '090-4135-2268', NULL, '奈良県香芝市北今市2-276-1レオネクストエクレール北今市202号室', NULL, NULL, NULL, '2025-10-05 06:47:48.484+00', '2025-10-05 06:47:47.866022+00', NULL, '在籍中', NULL, 'UH76968666LA', '2026-04-24', '2026-04-24', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1118', NULL),
	('1074', 'SOE MIN THU', 'ミン', 'ミャンマー', '2005-02-02', '090-5304-1858', NULL, '大阪府門真市小路町3番2- 104号', NULL, NULL, NULL, '2025-10-05 06:47:48.531+00', '2025-10-05 06:47:47.909308+00', NULL, '在籍中', NULL, 'UH54075018LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1128', NULL),
	('1129', 'WAI YAN HTAY', 'ウェイヤン', 'ミャンマー', '1999-01-14', '070-2633-0201', NULL, '鳥取県米子市皆生温泉1丁目３番63-206号', NULL, NULL, NULL, '2025-10-05 06:47:48.566+00', '2025-10-05 06:47:47.945099+00', NULL, '在籍中', NULL, 'UH84029016LA', '2026-04-24', '2026-04-24', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1129', NULL),
	('2683', 'KHANT ZAYAR WIN', 'カン', 'ミャンマー', '2003-05-18', '080-2157-3675', NULL, '大阪府藤井寺市川北３丁目４−２３', NULL, NULL, NULL, '2025-10-05 06:47:48.586+00', '2025-10-05 06:47:47.965702+00', NULL, '退職', NULL, 'SA02016019MA', '2025-10-28', '2025-10-28', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1714', NULL),
	('2685', 'MIN HTUN', 'ミン', 'ミャンマー', '1998-02-10', '080-2033-7397', NULL, '大阪府貝塚市三ツ松745-1 レオパレスサンエイ202号', NULL, NULL, NULL, '2025-10-05 06:47:48.608+00', '2025-10-05 06:47:47.986782+00', NULL, '在籍中', NULL, 'UH14638645EA', '2026-10-28', '2026-10-28', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1716', NULL),
	('2872', 'ADHIKARI BHESHRAJ', 'べシーラジ', 'ネパール', '1995-04-22', '07043869357', NULL, '大阪府門真市浜町11−18 レオパレスナカトミ 201号', NULL, NULL, NULL, '2025-10-05 06:47:48.643+00', '2025-10-05 06:47:48.021527+00', NULL, '在籍中', NULL, 'UH61979059MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1893', NULL),
	('2874', 'LOPCHAN SUMAN', 'スーマン', 'ネパール', '1998-09-09', '08010438017', NULL, '滋賀県守山市二町町215-3 レオパレストルマリン 201号', NULL, NULL, NULL, '2025-10-05 06:47:48.662+00', '2025-10-05 06:47:48.040444+00', NULL, '在籍中', NULL, 'UH81266611MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1895', NULL),
	('2877', 'RAI DHAN RAJ', 'ラージ', 'ネパール', '2003-07-19', '08085228159', NULL, '奈良県御所市三室532-1 ルーチェみむろ 206', NULL, NULL, NULL, '2025-10-05 06:47:48.691+00', '2025-10-05 06:47:48.06965+00', NULL, '在籍中', NULL, 'UH28412482MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1898', NULL),
	('2879', 'BOHARA HARISH', 'ハリッシ', 'ネパール', '1998-05-12', '‪+81 80‑2587‑9068‬', NULL, '奈良県葛城市西辻179-1レスポワールC 棟203', NULL, NULL, NULL, '2025-10-05 06:47:48.709+00', '2025-10-05 06:47:48.086977+00', NULL, '在籍中', NULL, 'UH01994529MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1900', NULL),
	('2882', 'SAUD SHYAM', 'シャム', 'ネパール', '2001-10-06', '09074978104', NULL, '京都府京都市左京区岩倉花園町１２５−１ レオパレス花園 212', NULL, NULL, NULL, '2025-10-05 06:47:48.735+00', '2025-10-05 06:47:48.112987+00', NULL, '在籍中', NULL, 'UH56826705MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1903', NULL),
	('2884', 'NAGARKOTI BISHNU', 'ビスヌ', 'ネパール', '1996-02-13', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:48.751+00', '2025-10-05 06:47:48.129306+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1905', NULL),
	('2886', 'GURUNG SAMPURNA', 'サンプルナ', 'ネパール', '1998-07-15', '08085185239', NULL, '大阪府藤井寺市川北3-4-23ー301号', NULL, NULL, NULL, '2025-10-05 06:47:48.769+00', '2025-10-05 06:47:48.147379+00', NULL, '在籍中', NULL, 'UH22298176MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1907', NULL),
	('2891', 'NAING HTET SOE', 'ソー', 'ミャンマー', '2004-05-10', '090-7095-1492', NULL, '奈良県五條市釜窪町１４８−２ 余慶マンション1２号', NULL, NULL, NULL, '2025-10-05 06:47:48.794+00', '2025-10-05 06:47:48.172473+00', NULL, '在籍中', NULL, 'UH20607494MA', '2026-01-29', '2026-01-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1912', NULL),
	('2894', 'THANT ZIN LIN', 'リン', 'ミャンマー', '2001-04-06', '090-3495-6248', NULL, '和歌山県紀の川市打田19-4 レオパレスアリスⅡ110号室', NULL, NULL, NULL, '2025-10-05 06:47:53.645+00', '2025-10-05 06:47:53.023112+00', NULL, '退職', NULL, 'UH21512426MA', '2026-01-29', '2026-01-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1915', NULL),
	('2898', 'YE YINT KYAW', 'チョー', 'ミャンマー', '2004-04-07', '090-5614-2469', NULL, '奈良県北葛城郡王寺町畠田4丁目12番11-202号', NULL, NULL, NULL, '2025-10-05 06:47:53.676+00', '2025-10-05 06:47:53.054791+00', NULL, '在籍中', NULL, 'UH33941211MA', '2026-01-29', '2026-01-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1919', NULL),
	('2911', 'ZAR NI TUN', 'トゥン', 'ミャンマー', '2000-03-27', '080-8897-3705', NULL, '大阪府松原市岡３丁目８番１ レオパレスサウスヒルズM&M １０６号', NULL, NULL, NULL, '2025-10-05 06:47:53.694+00', '2025-10-05 06:47:53.072374+00', NULL, '在籍中', NULL, ' UH81634923LA', '2026-01-10', '2026-01-10', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1888', NULL),
	('3046', 'THOKAR ANISH', 'アニス', 'ネパール', '1997-04-14', '070-9095-4721', NULL, '大阪府和泉市葛の葉町1-14-28 レオパレススルーク 107', NULL, NULL, NULL, '2025-10-05 06:47:53.719+00', '2025-10-05 06:47:53.099108+00', NULL, '在籍中', NULL, 'UH20129835LA', '2026-04-01', '2026-04-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2114', NULL),
	('510', 'SHERPA ANG DAMI', 'アンダミ', 'ネパール', '1998-05-27', '080-9436-3916', NULL, '大阪府堺市美原区多治井86番地1レオネクスト美原野元102', NULL, NULL, NULL, '2025-10-05 06:47:48.2+00', '2025-10-05 06:47:47.578254+00', NULL, '在籍中', NULL, 'SA01921012LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '867', NULL),
	('511', 'KUNWAR ROSHAN', 'ロサン ', 'ネパール', '1995-10-08', '080-4936-1416', NULL, '大阪府河内長野市中片添町40番7-302号', NULL, NULL, NULL, '2025-10-05 06:47:48.208+00', '2025-10-05 06:47:47.586995+00', NULL, '在籍中', NULL, 'SA69138948LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '868', NULL),
	('513', 'BHANDARI LAXMAN', 'ラクスマン', 'ネパール', '1997-04-15', '080-4891-1829', NULL, '大阪府堺市西区鳳北町8丁453番地10  ファーウッド305号', NULL, NULL, NULL, '2025-10-05 06:47:48.233+00', '2025-10-05 06:47:47.612207+00', NULL, '在籍中', NULL, 'SA04404266LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '870', NULL),
	('516', 'BHANDARI RAJ', 'ラジュ', 'ネパール', '1999-01-31', '080-7164-9646', NULL, '大阪府堺市西区鳳北町8丁453番地10  ファーウッド304号', NULL, NULL, NULL, '2025-10-05 06:47:48.262+00', '2025-10-05 06:47:47.641006+00', NULL, '在籍中', NULL, 'SA32372707LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '873', NULL),
	('518', 'PUN KRISHNA BAHADUR', 'クリスナ', 'ネパール', '1989-02-25', '080-7519-8720', NULL, '大阪府和泉市上町361番地2レオパレスセレザ210', NULL, NULL, NULL, '2025-10-05 06:47:48.283+00', '2025-10-05 06:47:47.661037+00', NULL, '在籍中', NULL, 'SA70116477LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '875', NULL),
	('521', 'BAL KARAN', 'カラン', 'ネパール', '1992-10-28', '070-3263-3918', NULL, '奈良県葛城市西辻179-1 レスポワールC棟203', NULL, NULL, NULL, '2025-10-05 06:47:48.31+00', '2025-10-05 06:47:47.689324+00', NULL, '在籍中', NULL, 'SA01944592LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '878', NULL),
	('523', 'BASKOTA NAKUL', 'ナクル', 'ネパール', '1999-12-14', '080-7362-3138', NULL, '大阪府堺市東区草尾385番地1 レオパレス登美丘103号', NULL, NULL, NULL, '2025-10-05 06:47:48.33+00', '2025-10-05 06:47:47.708171+00', NULL, '支援終了', NULL, 'UH03769430LA', '2026-08-14', '2026-08-14', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '880', NULL),
	('524', 'KHADKA RAJESH', 'ラジェス', 'ネパール', '2000-10-18', '080-7373-2585', NULL, '奈良県葛城市西辻179番地1レスポワールC棟203号', NULL, NULL, NULL, '2025-10-05 06:47:48.338+00', '2025-10-05 06:47:47.716683+00', NULL, '退職', NULL, 'NP20766724LA', '2024-11-22', '2024-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '881', NULL),
	('526', 'GOLE BIKMAN', 'ビクマン', 'ネパール', '1994-08-02', '080-9425-7155', NULL, '大阪府和泉市上町361番地の2（レオパレスセレザ208号）', NULL, NULL, NULL, '2025-10-05 06:47:48.356+00', '2025-10-05 06:47:47.734361+00', NULL, '在籍中', NULL, 'SA00812091LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '883', NULL),
	('1043', 'TIN MYO WIN', 'ウィン', 'ミャンマー', '2003-04-09', '070-2823-2700', NULL, '大阪府大阪市東住吉区矢田4-10-23レオパレスNORTHV303', NULL, NULL, NULL, '2025-10-05 06:47:48.373+00', '2025-10-05 06:47:47.75176+00', NULL, '在籍中', NULL, 'UH13446762LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1097', NULL),
	('1046', 'AUNG KO ZIN', 'アウンコ', 'ミャンマー', '2000-11-19', '090-5305-9390', NULL, '大阪府門真市大倉町24-22レオパレスラフレシール301', NULL, NULL, NULL, '2025-10-05 06:47:48.39+00', '2025-10-05 06:47:47.768254+00', NULL, '在籍中', NULL, 'UH38899544LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1100', NULL),
	('1049', 'CHAN MIN TUN', 'チャン', 'ミャンマー', '2001-06-25', '080-8714-7754', NULL, '奈良県大和郡山市車町１４−１ レオパレスルオーテ104号室', NULL, NULL, NULL, '2025-10-05 06:47:48.406+00', '2025-10-05 06:47:47.785807+00', NULL, '在籍中', NULL, 'UH59289515LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1103', NULL),
	('1052', 'MIN THU KHAING', 'ミン', 'ミャンマー', '2003-11-09', '070-2806-0067', NULL, '大阪府大阪市住之江区北島２丁目10-10レオパレスAIR101', NULL, NULL, NULL, '2025-10-05 06:47:48.426+00', '2025-10-05 06:47:47.804808+00', NULL, '在籍中', NULL, 'UH14658379LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1106', NULL),
	('1055', 'NAING LIN ZAW', 'ナイン', 'ミャンマー', '2003-03-15', '080-7848-5168', NULL, '和歌山県伊都郡かつらぎ町中飯降1122-1セレノ･カーサB202', NULL, NULL, NULL, '2025-10-05 06:47:48.447+00', '2025-10-05 06:47:47.825398+00', NULL, '在籍中', NULL, 'UH82678102LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1109', NULL),
	('2887', 'SHERPA NGIMA ', 'セルパ', 'ネパール', '2005-02-07', '09051280436', NULL, '兵庫県尼崎市西立花町２−１５−７ レオパレスシルク立花 104', NULL, NULL, NULL, '2025-10-05 06:47:48.778+00', '2025-10-05 06:47:48.155946+00', NULL, '在籍中', NULL, 'UH52294517MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1908', NULL),
	('3140', 'TAMANG SUNITA', 'スニタ', 'ネパール', '1999-08-26', '080-6384-8642', NULL, '鳥取県米子市皆生温泉1-3-63 レオパレスさつき　205号', NULL, NULL, NULL, '2025-10-05 06:47:53.747+00', '2025-10-05 06:47:53.125278+00', NULL, '在籍中', NULL, 'UH82667195LA', '2026-06-13', '2026-06-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2178', NULL),
	('3154', 'GHARTI DICTION', 'ディクション', 'ネパール', '1997-05-22', '0729720568', NULL, '大阪府河内長野市北青葉台1-14 グリーンハイツ芝Ⅰ 201', NULL, NULL, NULL, '2025-10-05 06:47:53.771+00', '2025-10-05 06:47:53.149297+00', NULL, '在籍中', NULL, 'UH29214537MA', '2026-09-16', '2026-09-16', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2273', NULL),
	('3155', 'THIN YU MON', 'ユ', 'ミャンマー', '1996-04-16', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.779+00', '2025-10-05 06:47:53.157148+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2290', NULL),
	('3245', 'CHALAUNE HEM RAJ', 'シャラウネ', 'ネパール', '2001-05-28', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.804+00', '2025-10-05 06:47:53.182244+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2429', NULL),
	('3246', 'SAPKOTA KRISHAL', 'サプコタ', 'ネパール', '2006-07-04', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.812+00', '2025-10-05 06:47:53.190341+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2430', NULL),
	('3247', 'GHARTIMAGAR MEGH RAJ', 'ガルティ', 'ネパール', '1991-03-15', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.82+00', '2025-10-05 06:47:53.197612+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2431', NULL),
	('3248', 'TAMANG TARA BAHADUR', 'タマン', 'ネパール', '1989-11-26', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.827+00', '2025-10-05 06:47:53.205404+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2432', NULL),
	('3410', 'HTOO NAW LINN', 'リン', 'ミャンマー', '2003-03-29', '070-8526-4055', NULL, '京都府京都市中京区姉西洞院町529 アブレスト西洞院3B', NULL, NULL, NULL, '2025-10-05 06:47:53.852+00', '2025-10-05 06:47:53.230296+00', NULL, '入社待ち', NULL, 'SA78276813MA', '2025-09-17', '2025-09-17', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2574', NULL),
	('3413', 'BHANDARI LILADHAR', 'リラダル', 'ネパール', '1989-07-14', '07085077553', NULL, '鹿児島県南九州市頴娃町牧之内2985番地1', NULL, NULL, NULL, '2025-10-05 06:47:53.889+00', '2025-10-05 06:47:53.267805+00', NULL, '入社待ち', NULL, 'UH85902605FA', '2026-05-16', '2026-05-16', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2626', NULL),
	('3414', 'KHANAL KIRAN', 'キラン', 'ネパール', '2003-04-19', '070-9204-7275', NULL, '茨城県鉾田市造谷1375番地322', NULL, NULL, NULL, '2025-10-05 06:47:53.897+00', '2025-10-05 06:47:53.275598+00', NULL, '入社待ち', NULL, 'UH08937440FA', '2026-02-02', '2026-02-02', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2623', NULL),
	('3509', 'KHAING THAZIN', 'カイ', 'ミャンマー', '1996-05-20', '070-8941-6010', NULL, '福岡県福津市花見が丘1-12-5レオパレス花見が丘K.M108', NULL, NULL, NULL, '2025-10-05 06:47:53.923+00', '2025-10-05 06:47:53.301393+00', NULL, '入社待ち', NULL, 'SA38679145EA', '2025-11-21', '2025-11-21', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2654', NULL),
	('3515', 'RANEPURA KANKANAM KANATHTHAGE SUMEDA', 'スメーダー', 'スリランカ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.949+00', '2025-10-05 06:47:53.327286+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2673', NULL),
	('3526', 'THARU PRABIN', 'パルビン', 'ネパール', '1999-12-01', '09054311188', NULL, '東京都江戸川区篠崎町6-3-12 カーサ グランデイー ル 210番', NULL, NULL, NULL, '2025-10-05 06:47:53.957+00', '2025-10-05 06:47:53.337453+00', NULL, '入社待ち', NULL, 'UH655071116EA', '2026-03-25', '2026-03-25', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2675', NULL),
	('3527', 'CHAUDHARY RUMAN', 'ルマン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.969+00', '2025-10-05 06:47:53.348597+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2684', NULL),
	('3530', 'BOKATI MUKESH BAHADUR', 'ムケシュ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.992+00', '2025-10-05 06:47:53.370592+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2688', NULL),
	('3533', 'DHAMALA LAXMAN PASAD', 'ダマラ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.001+00', '2025-10-05 06:47:53.379131+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2690', NULL),
	('3535', 'JOSHI SAROJ', 'サロジ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.02+00', '2025-10-05 06:47:53.404304+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2692', NULL),
	('3536', 'LIMBU SINGYUK', 'シンユク', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.04+00', '2025-10-05 06:47:53.419461+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2693', NULL),
	('3537', 'MALLA THAKURI ANIL', 'アニル', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.05+00', '2025-10-05 06:47:53.428034+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2694', NULL),
	('3539', 'MASRANGI GOVINDA BAHADUR', 'ゴヴィンダ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.067+00', '2025-10-05 06:47:53.445256+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2696', NULL),
	('3540', 'MUDEL AASHISH', 'アーシッシュ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.076+00', '2025-10-05 06:47:53.454332+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2697', NULL),
	('3542', 'TAMANG RAJMAN', 'ラジマン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.092+00', '2025-10-05 06:47:53.470225+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2699', NULL),
	('3543', 'SHRESTHA HARI BAHADUR', 'ハリ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.1+00', '2025-10-05 06:47:53.478197+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2700', NULL),
	('1061', 'THAW ZIN AUNG', 'アウン', 'ミャンマー', '2001-01-26', '080-8717-1412', NULL, '和歌山県橋本市高野口町伏原レオネクストル・シエル207', NULL, NULL, NULL, '2025-10-05 06:47:48.474+00', '2025-10-05 06:47:47.853832+00', NULL, '在籍中', NULL, 'UH18902177LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1115', NULL),
	('1067', 'PHYO HAN KYAW', 'ピョー', 'ミャンマー', '1999-03-21', '080-2075-5526', NULL, '大阪府大阪市淀川区西中島2-10-23レオパレスルーナ202号室 ', NULL, NULL, NULL, '2025-10-05 06:47:48.497+00', '2025-10-05 06:47:47.875312+00', NULL, '在籍中', NULL, 'UH34409536LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1121', NULL),
	('1069', 'YAR ZAR TUN', 'トゥン', 'ミャンマー', '2000-10-30', '070-4416-3347', NULL, '奈良県北葛城郡上牧町中筋出作15ロイヤルガーデン上牧B303号室', NULL, NULL, NULL, '2025-10-05 06:47:48.506+00', '2025-10-05 06:47:47.884709+00', NULL, '在籍中', NULL, 'UH29965295LA', '2026-04-24', '2026-04-24', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1123', NULL),
	('1073', 'YE HTUT SOE', 'イェ', 'ミャンマー', '1999-10-13', '080-1157-2054', NULL, '大阪府藤井寺市川北3-4-23-311号室 ', NULL, NULL, NULL, '2025-10-05 06:47:48.524+00', '2025-10-05 06:47:47.901792+00', NULL, '在籍中', NULL, 'UH82394729LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1127', NULL),
	('1076', 'YE WUNNA HTUN', 'イェ', 'ミャンマー', '2004-06-25', '080-2671-6440', NULL, '奈良県大和郡山市新町８０５−３ レオパレスSHOW102号室', NULL, NULL, NULL, '2025-10-05 06:47:48.539+00', '2025-10-05 06:47:47.916809+00', NULL, '在籍中', NULL, 'UH00125354LA', '2026-04-24', '2026-04-24', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1130', NULL),
	('1094', 'OAK SOE HTUT', 'ソー', 'ミャンマー', '2002-10-13', '070-2632-9855', NULL, '奈良県五條市住川町66番コーポナカイⅡ307号室', NULL, NULL, NULL, '2025-10-05 06:47:48.547+00', '2025-10-05 06:47:47.926605+00', NULL, '在籍中', NULL, 'UH23444393LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1149', NULL),
	('1096', 'MYO MIN HEIN', 'ミョー', 'ミャンマー', '2003-06-15', '090-7943-8720', NULL, '大阪府富田林市川向町レオパレス平和307号室', NULL, NULL, NULL, '2025-10-05 06:47:48.557+00', '2025-10-05 06:47:47.93548+00', NULL, '在籍中', NULL, 'UH98572738LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1151', NULL),
	('2682', 'NYO MIN KHANT', 'カン', 'ミャンマー', '2000-04-15', '090-8882-2221', NULL, '大阪府藤井寺市川北3丁目4-23-311', NULL, NULL, NULL, '2025-10-05 06:47:48.576+00', '2025-10-05 06:47:47.956243+00', NULL, '在籍中', NULL, 'UH12945226EA', '2026-10-28', '2026-10-28', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1713', NULL),
	('2684', 'ZWE HTET NAING', 'ズェ', 'ミャンマー', '2002-06-16', '080-2644-6035', NULL, '大阪府大阪市此花区酉島５丁目２番17号レオパレスHaruhi104号室', NULL, NULL, NULL, '2025-10-05 06:47:48.599+00', '2025-10-05 06:47:47.97726+00', NULL, '在籍中', NULL, 'UH82262799EA', '2026-10-28', '2026-10-28', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1715', NULL),
	('2832', 'KHATRI DEVENDRA', 'カトリ', 'ネパール', '2004-05-12', '070 90593267', NULL, '大阪府大阪市東住吉区住道矢田4丁目13番16号　レオパレス21マツヤ 303号', NULL, NULL, NULL, '2025-10-05 06:47:48.62+00', '2025-10-05 06:47:48.000352+00', NULL, '在籍中', NULL, 'UH59854002MA', '2026-01-13', '2026-01-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1831', NULL),
	('2871', 'ACHARYA PRADIP', 'プラディプ', 'ネパール', '2001-12-05', '09051302742', NULL, '奈良県北葛城郡上牧町上牧537-1ボヌール202', NULL, NULL, NULL, '2025-10-05 06:47:48.632+00', '2025-10-05 06:47:48.012747+00', NULL, '在籍中', NULL, 'UH01672218MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1892', NULL),
	('2873', 'DHANUK DEBENDRA', 'デべンドラ', 'ネパール', '2002-07-20', '09073696185', NULL, '大阪府大阪市旭区中宮２−７−８ レオパレスＫＫＳ中宮 204号', NULL, NULL, NULL, '2025-10-05 06:47:48.653+00', '2025-10-05 06:47:48.032035+00', NULL, '在籍中', NULL, 'UH54031809MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1894', NULL),
	('2875', 'LAMA JHALAK', 'ジャラク', 'ネパール', '1993-01-18', '09050610745', NULL, '大阪府守口市梶町３−５５−９レオパレス和友  305 号室', NULL, NULL, NULL, '2025-10-05 06:47:48.671+00', '2025-10-05 06:47:48.049589+00', NULL, '在籍中', NULL, 'UH92456338MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1896', NULL),
	('2876', 'TAMANG SHYAM', 'シャム', 'ネパール', '2003-05-20', '+819051248355', NULL, '大阪府藤井寺市川北3-4-23　308号', NULL, NULL, NULL, '2025-10-05 06:47:48.68+00', '2025-10-05 06:47:48.060568+00', NULL, '在籍中', NULL, 'UH67418614MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1897', NULL),
	('2878', 'BOHARA KESHAB BAHADUR', 'バハドゥル', 'ネパール', '1994-05-29', '09051248201', NULL, '奈良県北葛城郡上牧町上牧537-1ボヌール202', NULL, NULL, NULL, '2025-10-05 06:47:48.7+00', '2025-10-05 06:47:48.07892+00', NULL, '在籍中', NULL, 'UH06238914MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1899', NULL),
	('2880', 'JOSHI NAVRAJ', 'ナヴラージ', 'ネパール', '1997-11-11', '09050611554', NULL, '兵庫県神戸市垂水区名谷町字北ノ屋敷3044-1　レオパレス北野屋敷206', NULL, NULL, NULL, '2025-10-05 06:47:48.718+00', '2025-10-05 06:47:48.095718+00', NULL, '在籍中', NULL, 'UH19285303MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1901', NULL),
	('2881', 'LAMA NURBU', 'ヌルブ', 'ネパール', '2003-03-16', '09088493196', NULL, '奈良県御所市三室532-1 ルーチェみむろ 206号', NULL, NULL, NULL, '2025-10-05 06:47:48.726+00', '2025-10-05 06:47:48.103746+00', NULL, '在籍中', NULL, 'UH42130028MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1902', NULL),
	('2883', 'SHAH PADAM', 'パダム', 'ネパール', '2001-08-23', '08025565197', NULL, '兵庫県神戸市北区鈴蘭台南町3-8-9　　レオパレスニシスズラン　101', NULL, NULL, NULL, '2025-10-05 06:47:48.743+00', '2025-10-05 06:47:48.121343+00', NULL, '在籍中', NULL, 'UH54444944MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1904', NULL),
	('2888', 'TAJPURIYA SANJIT KUMAR', 'クマル', 'ネパール', '1994-11-21', '090-5061-0385', NULL, '滋賀県草津市矢倉2-5-31 レオパレスＧＲＥＥＮ　ＣＯＡＴ 201', NULL, NULL, NULL, '2025-10-05 06:47:48.786+00', '2025-10-05 06:47:48.163984+00', NULL, '在籍中', NULL, 'UH32154013MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1909', NULL),
	('2892', 'AUNG CHAN PHYO', 'アウン', 'ミャンマー', '2002-06-13', '090-3495-3294', NULL, '奈良県橿原市葛本町830-1レオパレ スポムール栄延207', NULL, NULL, NULL, '2025-10-05 06:47:48.803+00', '2025-10-05 06:47:48.181374+00', NULL, '在籍中', NULL, 'UH61361035MA', '2026-01-29', '2026-01-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1913', NULL),
	('2896', 'HTUN YAN', 'トン', 'ミャンマー', '2003-02-28', '090-4868-4347', NULL, '奈良県北葛城郡上牧町中筋出作15-7ロイヤルガーデン上牧A303', NULL, NULL, NULL, '2025-10-05 06:47:53.667+00', '2025-10-05 06:47:53.046335+00', NULL, '在籍中', NULL, 'UH22287582MA', '2026-01-29', '2026-01-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1917', NULL),
	('2902', 'AUNG THET PAING HMUE', 'アウン', 'ミャンマー', '1995-06-18', '09041353837', NULL, '大阪府大阪市城東区野江２丁目14-6 レオパレスセジュール野江203', NULL, NULL, NULL, '2025-10-05 06:47:53.685+00', '2025-10-05 06:47:53.063498+00', NULL, '在籍中', NULL, 'SA76005785JA', '2025-11-18', '2025-11-18', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1881', NULL),
	('2912', 'NEPALI LOKENDRA ', 'ロケン', 'ネパール', '1985-05-31', '090- 4421 -1901', NULL, '大阪府和泉市上町361番地の2 （レオパレスセレザ10 5）', NULL, NULL, NULL, '2025-10-05 06:47:53.702+00', '2025-10-05 06:47:53.08052+00', NULL, '在籍中', NULL, 'UH21661134LA', '2026-11-29', '2026-11-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1932', NULL),
	('3051', 'TAMANG ILAM', 'イラム', 'ネパール', '2002-08-28', '070-9089-3633', NULL, '大阪府河内長野市寿町2-37 レオパレスM&MII　102', NULL, NULL, NULL, '2025-10-05 06:47:53.739+00', '2025-10-05 06:47:53.117187+00', NULL, '在籍中', NULL, 'UH36096164LA', '2026-04-01', '2026-04-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2122', NULL),
	('3152', 'THAPA DEEPAK', 'ディパク', 'ネパール', '1991-03-04', '09052069274', NULL, '大阪府河内長野市北青葉台1-14 グリーンハイツ芝Ⅰ 201', NULL, NULL, NULL, '2025-10-05 06:47:53.755+00', '2025-10-05 06:47:53.133423+00', NULL, '在籍中', NULL, 'UH20471983MA', '2026-09-16', '2026-09-16', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2271', NULL),
	('3234', 'CHAPAGAIN RAJESH', 'ラジェシュ', 'ネパール', '2000-08-20', '08015841375', NULL, '大阪府藤井寺市川北3-4-23  309号', NULL, NULL, NULL, '2025-10-05 06:47:53.787+00', '2025-10-05 06:47:53.165086+00', NULL, '在籍中', NULL, 'UH85392858EA', '2026-07-02', '2026-07-02', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1990', NULL),
	('3249', 'DANGI RAM', 'ダンギ', 'ネパール', '1992-01-09', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.836+00', '2025-10-05 06:47:53.213921+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2433', NULL),
	('3412', 'SALIK RAM ACHARYA', 'サリク', 'ネパール', '1985-12-28', '09085063741', NULL, '大阪府河内長野市寿町２−３７ レオパレスＭ＆ＭⅡ 201 号室', NULL, NULL, NULL, '2025-10-05 06:47:53.877+00', '2025-10-05 06:47:53.258494+00', NULL, '在籍中', NULL, 'UH01781713LA', '2026-09-25', '2026-09-25', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2372', NULL),
	('3508', 'WINT WAH NAING', 'ウィ ワー', 'ミャンマー', '1998-02-07', '090-4105-9154', NULL, '鹿児島県鹿児島市喜入前之浜町7511番地 ', NULL, NULL, NULL, '2025-10-05 06:47:53.914+00', '2025-10-05 06:47:53.292652+00', NULL, '入社待ち', NULL, 'SA67630462EA', '2025-11-17', '2025-11-17', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2651', NULL),
	('3510', 'KYI KYI ZAW', 'チー', 'ミャンマー', '2000-06-27', '07091822359', NULL, '京都府京都市中京区小川通六角下る元本能寺町３７７番地ハイツグロース', NULL, NULL, NULL, '2025-10-05 06:47:53.932+00', '2025-10-05 06:47:53.309819+00', NULL, '入社待ち', NULL, 'UH77879453EA', '2026-08-15', '2026-08-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2642', NULL),
	('3534', 'GURUNG MANISH', 'マニッシュ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.01+00', '2025-10-05 06:47:53.387791+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2691', NULL),
	('3538', 'MALLA KIRAN', 'キラン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.058+00', '2025-10-05 06:47:53.436438+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2695', NULL),
	('3544', 'SHRESTHA AAKASH', 'アカス', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.108+00', '2025-10-05 06:47:53.485383+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2701', NULL),
	('527', 'KHATRI SANJIB', 'サンジブ', 'ネパール', '1992-03-05', '07018475982', NULL, '鳥取県米子市皆生温泉1-3-63 レオパレスさつき　205号', NULL, NULL, NULL, '2025-10-05 06:49:21.46+00', '2025-10-05 06:49:21.15192+00', NULL, '在籍中', NULL, 'SA97179012LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '884', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0/image/image_884_1759646961685.png'),
	('505', 'SHERPA SUVASH', 'スバス', 'ネパール', '1996-12-12', '080-9657-5095', NULL, '大阪府河内長野市中片添町40番7 302号', NULL, NULL, NULL, '2025-10-05 06:47:48.145+00', '2025-10-05 06:47:47.528865+00', NULL, '在籍中', NULL, 'SA76754253LA', '2025-12-01', '2025-12-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '862', NULL),
	('520', 'THAPA DHAN BAHADUR', 'ダン ', 'ネパール', '1992-10-04', '070-3151-6835', NULL, '奈良県北葛城郡上牧町大字中筋出作15-2 ロイヤルガーデン上牧A-303', NULL, NULL, NULL, '2025-10-05 06:47:48.301+00', '2025-10-05 06:47:47.679621+00', NULL, '在籍中', NULL, 'SA28640988LA', '2025-11-22', '2025-11-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '877', NULL),
	('1056', 'NYEIN CHAN PHYO', 'ニェン', 'ミャンマー', '2000-06-05', '090-4724-7041', NULL, '大阪府大阪市平野区瓜破5-2-31レオパレスきらら201号室', NULL, NULL, NULL, '2025-10-05 06:47:48.456+00', '2025-10-05 06:47:47.833919+00', NULL, '在籍中', NULL, 'UH26285296LA', '2026-04-15', '2026-04-15', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1110', NULL),
	('1071', 'NAY HTET LIN', 'ネー', 'ミャンマー', '2005-05-12', '070-2806-1048', NULL, '奈良県北葛城郡上牧町中筋出作15ロイヤルガーデン上牧B303', NULL, NULL, NULL, '2025-10-05 06:47:48.514+00', '2025-10-05 06:47:47.89256+00', NULL, '在籍中', NULL, 'UH52304157LA', '2026-04-24', '2026-04-24', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1125', NULL),
	('2885', 'SYANGTAN DIPENDRA', 'ディペンドラ', 'ネパール', '1997-03-22', '080-8518-5126', NULL, '滋賀県東近江市五個荘竜田町185レオパレス五個荘 206', NULL, NULL, NULL, '2025-10-05 06:47:48.76+00', '2025-10-05 06:47:48.139243+00', NULL, '在籍中', NULL, 'UH56178801MA', '2026-03-13', '2026-03-13', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1906', NULL),
	('2893', 'PHYO ARKAR', 'ピョー', 'ミャンマー', '2003-05-25', '090-3495-4408', NULL, '奈良県北葛城郡上牧町中筋出作１５−2　ロイヤルガーデン上牧A301号室', NULL, NULL, NULL, '2025-10-05 06:47:48.812+00', '2025-10-05 06:47:53.011515+00', NULL, '在籍中', NULL, 'UH35349727MA', '2026-01-29', '2026-01-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1914', NULL),
	('2895', 'WAI PHYO AUNG', 'ピョー', 'ミャンマー', '2004-04-22', '080-2644-6254', NULL, '奈良県五條市住川町66 コーポナカイ1   201号室', NULL, NULL, NULL, '2025-10-05 06:47:53.655+00', '2025-10-05 06:47:53.036045+00', NULL, '在籍中', NULL, 'UH57395911MA', '2026-01-29', '2026-01-29', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1916', NULL),
	('2963', 'GIRI KESHAR', 'ケシャル', 'ネパール', '2000-07-04', '09058787275', NULL, '大阪府大阪市西成区南津守1-1-47 レオパレスプラスパＢ 405', NULL, NULL, NULL, '2025-10-05 06:47:53.711+00', '2025-10-05 06:47:53.089157+00', NULL, '在籍中', NULL, 'UH50143982MA', '2026-04-22', '2026-04-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1994', NULL),
	('3047', 'SHYANGBO BIJAY', 'ビザエ', 'ネパール', '1998-02-05', '070-8475-3286', NULL, '大阪府和泉市池上町3-12-17 レオパレスパディーフィールド　102', NULL, NULL, NULL, '2025-10-05 06:47:53.731+00', '2025-10-05 06:47:53.109205+00', NULL, '在籍中', NULL, 'UH22724750LA', '2026-04-01', '2026-04-01', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2115', NULL),
	('3153', 'BHANDARI DIPAK', 'バンダリ', 'ネパール', '2000-06-15', '08083810097', NULL, '大阪府堺市中区陶器北４０５−１ 207', NULL, NULL, NULL, '2025-10-05 06:47:53.763+00', '2025-10-05 06:47:53.141616+00', NULL, '在籍中', NULL, 'UH42407256MA', '2026-09-16', '2026-09-16', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2272', NULL),
	('3235', 'AUNG MYAT NOE WIN', 'ウィン', 'ミャンマー', '2003-12-21', '070-9018-4105', NULL, '大阪府大阪市淀川区三津屋南1-13-6 レオパレスアクトⅡ 304号室', NULL, NULL, NULL, '2025-10-05 06:47:53.796+00', '2025-10-05 06:47:53.17451+00', NULL, '在籍中', NULL, 'UH55862780EA', '2026-09-08', '2026-09-08', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2157', NULL),
	('3397', 'THARU PRATIK SING', 'タル', 'ネパール', '1993-01-11', '08048205811', NULL, '大阪府堺市堺区東雲西町2丁2番34号 サンワード301', NULL, NULL, NULL, '2025-10-05 06:47:53.844+00', '2025-10-05 06:47:53.222006+00', NULL, '入社待ち', NULL, 'UH25621492EA', '2026-01-22', '2026-01-22', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2585', NULL),
	('3411', 'ADHIKARI ALISHA', 'アリサ', 'ネパール', '2002-05-11', '070-9042-8420', NULL, '埼玉県桶川市北1丁目23番4号 ティエル/201号', NULL, NULL, NULL, '2025-10-05 06:47:53.861+00', '2025-10-05 06:47:53.241976+00', NULL, '入社待ち', NULL, 'SA93462580EA', '2025-11-10', '2025-11-10', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2620', NULL),
	('3461', 'NEUPANE YAGYARAJ ', 'ネウパネ', 'ネパール', '2001-03-15', '080-7248-8053', NULL, '山口県下関市豊浦町川棚6237番地メゾンドF104号', NULL, NULL, NULL, '2025-10-05 06:47:53.906+00', '2025-10-05 06:47:53.284111+00', NULL, '入社待ち', NULL, 'UH20833268EA', '2026-08-05', '2026-08-05', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2637', NULL),
	('3514', 'SINGH SAROJ KUMAR ', 'シンガ　', 'ネパール', '1993-03-14', '07090771895', NULL, '大阪府大阪市都島区都島北通２−23−26 サンピアレス都島201号', NULL, NULL, NULL, '2025-10-05 06:47:53.941+00', '2025-10-05 06:47:53.31832+00', NULL, '入社待ち', NULL, 'UH46031294LA', '2026-07-30', '2026-07-30', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2662', NULL),
	('3529', 'BHATTA RAJU', 'ラズ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:53.982+00', '2025-10-05 06:47:53.362148+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2686', NULL),
	('3541', 'RAI PRADIP', 'プラディープ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 06:47:54.084+00', '2025-10-05 06:47:53.461656+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2698', NULL);


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

INSERT INTO "public"."sync_sessions" ("id", "tenant_id", "connector_id", "sync_type", "status", "start_time", "end_time", "total_count", "success_count", "failed_count", "error_message", "run_by", "created_at", "updated_at") VALUES
	('e28bfa9f-bd58-42c6-b0eb-19b3c7667969', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', 'manual', 'success', '2025-10-05 06:47:47.092872+00', '2025-10-05 06:47:54.116+00', 123, 123, 0, NULL, NULL, '2025-10-05 06:47:47.092872+00', '2025-10-05 06:47:53.491264+00'),
	('201861a9-035a-4d40-a7ff-4adb27972d2b', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '01994ddf-c0f8-4dc9-9c73-cd63a11333f1', 'manual', 'success', '2025-10-05 06:49:20.522967+00', '2025-10-05 06:49:21.79+00', 1, 1, 0, NULL, NULL, '2025-10-05 06:49:20.522967+00', '2025-10-05 06:49:21.165448+00');


--
-- Data for Name: sync_item_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sync_item_logs" ("id", "session_id", "item_type", "item_id", "status", "timestamp", "error_details", "created_at") VALUES
	('cfdb77b7-b7fb-4620-9674-810c442f508e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '504', 'success', '2025-10-05 06:47:47.514635+00', NULL, '2025-10-05 06:47:47.514635+00'),
	('a0e2aefd-eb03-41fd-a5cd-3188cdfcea45', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '505', 'success', '2025-10-05 06:47:47.533642+00', NULL, '2025-10-05 06:47:47.533642+00'),
	('f1ed282a-64f8-49b4-a08a-ee03f3584326', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '506', 'success', '2025-10-05 06:47:47.543998+00', NULL, '2025-10-05 06:47:47.543998+00'),
	('893fe35f-b6ca-4713-8915-c308f56f9d72', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '507', 'success', '2025-10-05 06:47:47.553034+00', NULL, '2025-10-05 06:47:47.553034+00'),
	('44f1167c-bb51-429f-a68b-8fb258d0007b', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '508', 'success', '2025-10-05 06:47:47.56337+00', NULL, '2025-10-05 06:47:47.56337+00'),
	('d150d5e2-56ee-4f4c-a726-f9f8d5a2b9e3', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '509', 'success', '2025-10-05 06:47:47.572654+00', NULL, '2025-10-05 06:47:47.572654+00'),
	('740c7ea8-295c-4537-935c-66aee6afe7c7', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '510', 'success', '2025-10-05 06:47:47.580924+00', NULL, '2025-10-05 06:47:47.580924+00'),
	('51102907-5f7d-4251-8f8f-ef26698b830f', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '511', 'success', '2025-10-05 06:47:47.595604+00', NULL, '2025-10-05 06:47:47.595604+00'),
	('5651e709-9fa6-4511-972a-5d7d27d3bced', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '512', 'success', '2025-10-05 06:47:47.605926+00', NULL, '2025-10-05 06:47:47.605926+00'),
	('c237f32a-538f-481c-b132-41fcffa114b4', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '513', 'success', '2025-10-05 06:47:47.615126+00', NULL, '2025-10-05 06:47:47.615126+00'),
	('75127d69-7ff2-415d-a60d-235b83d1a2c0', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '514', 'success', '2025-10-05 06:47:47.625159+00', NULL, '2025-10-05 06:47:47.625159+00'),
	('e92e16b1-9c15-437a-91f0-10d15a044bb5', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '515', 'success', '2025-10-05 06:47:47.634468+00', NULL, '2025-10-05 06:47:47.634468+00'),
	('b74deec2-6173-475a-a5d9-e204c75a4766', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '516', 'success', '2025-10-05 06:47:47.644541+00', NULL, '2025-10-05 06:47:47.644541+00'),
	('496d0c7a-0b62-4778-be2d-01c328fe2c02', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '517', 'success', '2025-10-05 06:47:47.655371+00', NULL, '2025-10-05 06:47:47.655371+00'),
	('4ee62ec8-6b0c-4397-96f3-a34a602a8dbe', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '518', 'success', '2025-10-05 06:47:47.664618+00', NULL, '2025-10-05 06:47:47.664618+00'),
	('54e6366a-051b-4de9-8439-8d982d85f4a9', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '519', 'success', '2025-10-05 06:47:47.67347+00', NULL, '2025-10-05 06:47:47.67347+00'),
	('062aebbd-0516-405b-ac1f-722cb91ff4d4', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '520', 'success', '2025-10-05 06:47:47.682546+00', NULL, '2025-10-05 06:47:47.682546+00'),
	('fb9bd361-fb33-4274-a1ce-28b5964d895d', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '521', 'success', '2025-10-05 06:47:47.69293+00', NULL, '2025-10-05 06:47:47.69293+00'),
	('29d0a222-0c46-46d2-a6af-a5ea5ab7f601', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '522', 'success', '2025-10-05 06:47:47.702584+00', NULL, '2025-10-05 06:47:47.702584+00'),
	('acec40e7-8b36-4127-af6a-3817391bf802', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '523', 'success', '2025-10-05 06:47:47.710792+00', NULL, '2025-10-05 06:47:47.710792+00'),
	('4dacc8f9-43ce-496e-9f98-d1660210f901', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '524', 'success', '2025-10-05 06:47:47.71987+00', NULL, '2025-10-05 06:47:47.71987+00'),
	('bf372727-a81f-4833-8161-57f82a54496e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '525', 'success', '2025-10-05 06:47:47.72867+00', NULL, '2025-10-05 06:47:47.72867+00'),
	('27282dd6-4f45-4df8-8034-42d2accce4b4', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '526', 'success', '2025-10-05 06:47:47.737625+00', NULL, '2025-10-05 06:47:47.737625+00'),
	('d59f6d40-da8a-4a72-80d0-7f783f5f6d7c', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '527', 'success', '2025-10-05 06:47:47.745986+00', NULL, '2025-10-05 06:47:47.745986+00'),
	('6fcd2234-feab-4ec5-b99d-3d16d7a9773d', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1043', 'success', '2025-10-05 06:47:47.754525+00', NULL, '2025-10-05 06:47:47.754525+00'),
	('f8000ad5-5040-4c60-a6cf-2c4ce2f06d92', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1045', 'success', '2025-10-05 06:47:47.762441+00', NULL, '2025-10-05 06:47:47.762441+00'),
	('76b6cb52-96ea-468c-9490-7520161f3253', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1046', 'success', '2025-10-05 06:47:47.770951+00', NULL, '2025-10-05 06:47:47.770951+00'),
	('eff35c88-5a56-4f63-ad40-98a5b7a63c60', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1048', 'success', '2025-10-05 06:47:47.778645+00', NULL, '2025-10-05 06:47:47.778645+00'),
	('dd801462-8405-424e-b5d0-d21538bd5074', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1049', 'success', '2025-10-05 06:47:47.788912+00', NULL, '2025-10-05 06:47:47.788912+00'),
	('ca478d5d-97b7-428e-92ad-0fb7cfac8275', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1051', 'success', '2025-10-05 06:47:47.798114+00', NULL, '2025-10-05 06:47:47.798114+00'),
	('e73d5d73-717a-40ee-a870-3a1762b4bf7a', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1052', 'success', '2025-10-05 06:47:47.810654+00', NULL, '2025-10-05 06:47:47.810654+00'),
	('3397bd19-91ef-42cb-8b21-c6ae1add2b0e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1054', 'success', '2025-10-05 06:47:47.81931+00', NULL, '2025-10-05 06:47:47.81931+00'),
	('b8f94aae-4d3e-40d7-b604-a681dab9cb06', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1055', 'success', '2025-10-05 06:47:47.828448+00', NULL, '2025-10-05 06:47:47.828448+00'),
	('68cb6314-152a-4244-b298-9d732c3c6c35', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1056', 'success', '2025-10-05 06:47:47.836908+00', NULL, '2025-10-05 06:47:47.836908+00'),
	('964e172a-7a1a-40f9-917a-79feebb92d8b', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1058', 'success', '2025-10-05 06:47:47.845692+00', NULL, '2025-10-05 06:47:47.845692+00'),
	('b115226d-40fc-4099-b9cf-baacc7eae9e0', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1061', 'success', '2025-10-05 06:47:47.856517+00', NULL, '2025-10-05 06:47:47.856517+00'),
	('8584cedb-ddb9-44cb-8c09-5113b1a6665c', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1064', 'success', '2025-10-05 06:47:47.869119+00', NULL, '2025-10-05 06:47:47.869119+00'),
	('9f890fa4-cb11-4dd0-9337-17be8c54399c', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1067', 'success', '2025-10-05 06:47:47.87903+00', NULL, '2025-10-05 06:47:47.87903+00'),
	('f3942c7c-6048-4cdb-bae1-57d30c19dcbb', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1069', 'success', '2025-10-05 06:47:47.887456+00', NULL, '2025-10-05 06:47:47.887456+00'),
	('571a918f-2407-457a-844a-a36adb8ea37b', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1071', 'success', '2025-10-05 06:47:47.896468+00', NULL, '2025-10-05 06:47:47.896468+00'),
	('468f83a9-e374-4124-aff9-a59021e251ae', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1073', 'success', '2025-10-05 06:47:47.904222+00', NULL, '2025-10-05 06:47:47.904222+00'),
	('055e9ef8-5e88-42a3-baaa-cee2ac50c01c', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1074', 'success', '2025-10-05 06:47:47.911702+00', NULL, '2025-10-05 06:47:47.911702+00'),
	('7f39ff0a-9608-48bf-8014-ac825c53d315', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1076', 'success', '2025-10-05 06:47:47.919725+00', NULL, '2025-10-05 06:47:47.919725+00'),
	('046e7180-ba91-4e89-8244-e9fef02fd03a', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1094', 'success', '2025-10-05 06:47:47.929305+00', NULL, '2025-10-05 06:47:47.929305+00'),
	('2ea2c036-900c-4427-a94a-ff19b1d71ca4', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1096', 'success', '2025-10-05 06:47:47.939265+00', NULL, '2025-10-05 06:47:47.939265+00'),
	('6e9df8e1-24d9-4c78-bcf2-18c2515b9d83', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '1129', 'success', '2025-10-05 06:47:47.948413+00', NULL, '2025-10-05 06:47:47.948413+00'),
	('8d07ff0c-ebac-45c8-b0c0-c7fbffb83d74', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2682', 'success', '2025-10-05 06:47:47.959273+00', NULL, '2025-10-05 06:47:47.959273+00'),
	('b9e723de-4dc1-4083-a681-9bb598defc8e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2683', 'success', '2025-10-05 06:47:47.969294+00', NULL, '2025-10-05 06:47:47.969294+00'),
	('9973271f-5918-4c2f-87c2-013307eddf47', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2684', 'success', '2025-10-05 06:47:47.980796+00', NULL, '2025-10-05 06:47:47.980796+00'),
	('acecf51b-7884-4a8f-a397-0553cf8a48f3', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2685', 'success', '2025-10-05 06:47:47.989572+00', NULL, '2025-10-05 06:47:47.989572+00'),
	('ce0eb308-8ce8-415a-8e81-03d8f2281bca', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2832', 'success', '2025-10-05 06:47:48.00506+00', NULL, '2025-10-05 06:47:48.00506+00'),
	('d83ec6da-c686-48be-acc2-ebb332cdf89b', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2871', 'success', '2025-10-05 06:47:48.015883+00', NULL, '2025-10-05 06:47:48.015883+00'),
	('83fbee87-5351-4d10-8503-004b025f1296', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2872', 'success', '2025-10-05 06:47:48.025295+00', NULL, '2025-10-05 06:47:48.025295+00'),
	('4f144ba2-8104-41b7-930a-e8c228ce50a1', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2873', 'success', '2025-10-05 06:47:48.034739+00', NULL, '2025-10-05 06:47:48.034739+00'),
	('50898a95-da4f-4bd4-b7ba-b957f6db7cd8', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2874', 'success', '2025-10-05 06:47:48.043872+00', NULL, '2025-10-05 06:47:48.043872+00'),
	('e3c311cd-b3c1-450d-8f32-7a87854530cd', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2875', 'success', '2025-10-05 06:47:48.052479+00', NULL, '2025-10-05 06:47:48.052479+00'),
	('457c8b7c-bff3-45d9-a49b-729bf01d8218', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2876', 'success', '2025-10-05 06:47:48.064003+00', NULL, '2025-10-05 06:47:48.064003+00'),
	('ef9e000d-da93-4bf6-a111-c46562cb21ca', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2877', 'success', '2025-10-05 06:47:48.072671+00', NULL, '2025-10-05 06:47:48.072671+00'),
	('f5f9ff37-e554-4890-981a-7eadb848842a', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2878', 'success', '2025-10-05 06:47:48.081766+00', NULL, '2025-10-05 06:47:48.081766+00'),
	('200b2052-e282-4cec-8317-92e0b3f9e5db', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2879', 'success', '2025-10-05 06:47:48.09051+00', NULL, '2025-10-05 06:47:48.09051+00'),
	('665cf8f9-b7b0-4c85-b5af-e26cbab57dd1', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2880', 'success', '2025-10-05 06:47:48.098732+00', NULL, '2025-10-05 06:47:48.098732+00'),
	('a720c77c-43ae-4cd7-b4f2-66190c87e948', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2881', 'success', '2025-10-05 06:47:48.107132+00', NULL, '2025-10-05 06:47:48.107132+00'),
	('caf4d299-3c9e-4c5a-8418-945005359be7', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2882', 'success', '2025-10-05 06:47:48.115693+00', NULL, '2025-10-05 06:47:48.115693+00'),
	('dd9de9a6-e3f2-4d4a-badc-5800f1fa5aa1', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2883', 'success', '2025-10-05 06:47:48.123899+00', NULL, '2025-10-05 06:47:48.123899+00'),
	('0148324c-8f67-44dc-82d6-3c39cd4254cb', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2884', 'success', '2025-10-05 06:47:48.132381+00', NULL, '2025-10-05 06:47:48.132381+00'),
	('2b6c2dc7-5834-4394-a922-0e4ffa6f3681', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2885', 'success', '2025-10-05 06:47:48.14209+00', NULL, '2025-10-05 06:47:48.14209+00'),
	('24bff5af-3f13-4260-9f48-4780eb50717e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2886', 'success', '2025-10-05 06:47:48.150738+00', NULL, '2025-10-05 06:47:48.150738+00'),
	('682e55bd-d657-41c7-8412-36c254f4383e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2887', 'success', '2025-10-05 06:47:48.159035+00', NULL, '2025-10-05 06:47:48.159035+00'),
	('5464839c-658a-4bb4-ab82-541985ad7be0', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2888', 'success', '2025-10-05 06:47:48.166736+00', NULL, '2025-10-05 06:47:48.166736+00'),
	('4286ed0e-d122-4886-b336-002eae282444', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2891', 'success', '2025-10-05 06:47:48.175797+00', NULL, '2025-10-05 06:47:48.175797+00'),
	('cf51cbff-be08-451e-a999-46ad69ec31be', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2892', 'success', '2025-10-05 06:47:48.184449+00', NULL, '2025-10-05 06:47:48.184449+00'),
	('92226fcf-7185-4874-8c60-9b2192bdbafd', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2893', 'success', '2025-10-05 06:47:53.016803+00', NULL, '2025-10-05 06:47:53.016803+00'),
	('fe0177b9-9943-4b56-99ea-d19f244a8432', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2894', 'success', '2025-10-05 06:47:53.027517+00', NULL, '2025-10-05 06:47:53.027517+00'),
	('cea5e347-0ed5-4c80-a485-9d4d6a7056f6', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2895', 'success', '2025-10-05 06:47:53.039856+00', NULL, '2025-10-05 06:47:53.039856+00'),
	('742f930d-2164-4b35-878b-49f3fffc70b6', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2896', 'success', '2025-10-05 06:47:53.04896+00', NULL, '2025-10-05 06:47:53.04896+00'),
	('9ecdfdb6-ace8-4812-98cd-4fc72832089b', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2898', 'success', '2025-10-05 06:47:53.057923+00', NULL, '2025-10-05 06:47:53.057923+00'),
	('16ee6c9f-2753-48af-afc5-bb2103c0af94', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2902', 'success', '2025-10-05 06:47:53.06612+00', NULL, '2025-10-05 06:47:53.06612+00'),
	('4ec638e4-6526-4736-a5a3-c094ea6c819e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2911', 'success', '2025-10-05 06:47:53.075174+00', NULL, '2025-10-05 06:47:53.075174+00'),
	('eeb97ed1-43fb-427c-87fc-4be4d91e2902', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2912', 'success', '2025-10-05 06:47:53.083161+00', NULL, '2025-10-05 06:47:53.083161+00'),
	('fbccbea9-c1e0-4c85-b0e0-63d534895fc0', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '2963', 'success', '2025-10-05 06:47:53.091792+00', NULL, '2025-10-05 06:47:53.091792+00'),
	('61c3956c-9998-486d-90bc-380a1a937ba9', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3046', 'success', '2025-10-05 06:47:53.103238+00', NULL, '2025-10-05 06:47:53.103238+00'),
	('936b8fc3-e045-47c5-8267-6f387aa1a819', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3047', 'success', '2025-10-05 06:47:53.111726+00', NULL, '2025-10-05 06:47:53.111726+00'),
	('60ca9dda-447f-4fc9-b81a-a48ddc27800e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3140', 'success', '2025-10-05 06:47:53.128002+00', NULL, '2025-10-05 06:47:53.128002+00'),
	('e4ec21c0-79b3-4310-ba71-64fa495d1b40', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3153', 'success', '2025-10-05 06:47:53.144078+00', NULL, '2025-10-05 06:47:53.144078+00'),
	('0c9a55d8-4d67-45bb-bf30-2e52749fc83f', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3155', 'success', '2025-10-05 06:47:53.160061+00', NULL, '2025-10-05 06:47:53.160061+00'),
	('38e9c484-3f0d-4a43-9114-97bdb6ba29a9', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3235', 'success', '2025-10-05 06:47:53.177097+00', NULL, '2025-10-05 06:47:53.177097+00'),
	('02f910c3-dd76-4f10-9c89-c954a0fc0b45', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3246', 'success', '2025-10-05 06:47:53.192834+00', NULL, '2025-10-05 06:47:53.192834+00'),
	('a976c396-34c8-4b0a-a12d-d0fe6a361463', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3248', 'success', '2025-10-05 06:47:53.208236+00', NULL, '2025-10-05 06:47:53.208236+00'),
	('541ea770-cd4a-489a-84f0-12c722f934b0', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3397', 'success', '2025-10-05 06:47:53.224919+00', NULL, '2025-10-05 06:47:53.224919+00'),
	('f8d7e752-0a82-4e6f-9490-e0897e4a6814', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3411', 'success', '2025-10-05 06:47:53.247925+00', NULL, '2025-10-05 06:47:53.247925+00'),
	('c364b229-9002-432b-bd9f-6d81ef787be2', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3413', 'success', '2025-10-05 06:47:53.27029+00', NULL, '2025-10-05 06:47:53.27029+00'),
	('80a8e45f-c3af-431b-bd41-10beba3c930a', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3461', 'success', '2025-10-05 06:47:53.286603+00', NULL, '2025-10-05 06:47:53.286603+00'),
	('3f87b19d-b576-4366-8994-e4af9da2a8af', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3509', 'success', '2025-10-05 06:47:53.304054+00', NULL, '2025-10-05 06:47:53.304054+00'),
	('768efb53-4421-41b5-96d0-42b123ba24ca', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3514', 'success', '2025-10-05 06:47:53.320983+00', NULL, '2025-10-05 06:47:53.320983+00'),
	('bf31785f-2000-44d4-a099-09630281881d', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3526', 'success', '2025-10-05 06:47:53.341174+00', NULL, '2025-10-05 06:47:53.341174+00'),
	('72c6332c-0766-4b73-931f-0f8cad8c2802', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3529', 'success', '2025-10-05 06:47:53.365109+00', NULL, '2025-10-05 06:47:53.365109+00'),
	('3cb35139-2561-4b52-914b-55c4229f3061', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3533', 'success', '2025-10-05 06:47:53.382176+00', NULL, '2025-10-05 06:47:53.382176+00'),
	('1e0cebe4-cd70-4c4f-a9ec-ef7e767d708c', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3535', 'success', '2025-10-05 06:47:53.409778+00', NULL, '2025-10-05 06:47:53.409778+00'),
	('7583876d-b9b5-4885-bd37-49e74e06d015', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3537', 'success', '2025-10-05 06:47:53.431005+00', NULL, '2025-10-05 06:47:53.431005+00'),
	('0fff79ce-9285-4735-b578-78b8a43a329f', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3539', 'success', '2025-10-05 06:47:53.448578+00', NULL, '2025-10-05 06:47:53.448578+00'),
	('bc3a239c-aa15-4b53-ab15-34082d6a9261', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3541', 'success', '2025-10-05 06:47:53.464408+00', NULL, '2025-10-05 06:47:53.464408+00'),
	('c1f40274-f922-4aef-bb8f-a245ae176499', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3543', 'success', '2025-10-05 06:47:53.480506+00', NULL, '2025-10-05 06:47:53.480506+00'),
	('6cb97a23-fd3f-4283-85ac-44b4b192690d', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3051', 'success', '2025-10-05 06:47:53.119988+00', NULL, '2025-10-05 06:47:53.119988+00'),
	('92cd021a-7638-4c9f-a34b-beb14a69bfc4', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3152', 'success', '2025-10-05 06:47:53.13633+00', NULL, '2025-10-05 06:47:53.13633+00'),
	('5f0e2939-781b-4c04-a54a-45f06b1aa801', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3154', 'success', '2025-10-05 06:47:53.151949+00', NULL, '2025-10-05 06:47:53.151949+00'),
	('9d43ed85-9315-488f-af2b-deb38e4950ed', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3234', 'success', '2025-10-05 06:47:53.168438+00', NULL, '2025-10-05 06:47:53.168438+00'),
	('582a4e1a-ceaa-4a0b-b51d-c9b1c0c78f29', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3245', 'success', '2025-10-05 06:47:53.185127+00', NULL, '2025-10-05 06:47:53.185127+00'),
	('5c7fe2c6-0cb3-4490-a7dc-060e460106ef', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3247', 'success', '2025-10-05 06:47:53.200034+00', NULL, '2025-10-05 06:47:53.200034+00'),
	('f962246c-6255-4169-b183-15818a1f8b52', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3249', 'success', '2025-10-05 06:47:53.216389+00', NULL, '2025-10-05 06:47:53.216389+00'),
	('df995e90-2480-4e87-966b-54b0423b9996', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3410', 'success', '2025-10-05 06:47:53.23306+00', NULL, '2025-10-05 06:47:53.23306+00'),
	('ff8a0bff-34cd-46b5-8118-d8a6e9de8af9', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3412', 'success', '2025-10-05 06:47:53.261992+00', NULL, '2025-10-05 06:47:53.261992+00'),
	('a731c094-a41e-442d-a7f4-5238748ba5c7', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3414', 'success', '2025-10-05 06:47:53.279163+00', NULL, '2025-10-05 06:47:53.279163+00'),
	('9b43d246-6b85-4906-b90b-8e3475f48da1', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3508', 'success', '2025-10-05 06:47:53.295821+00', NULL, '2025-10-05 06:47:53.295821+00'),
	('e713ed51-0987-474f-a8b6-78e5c1d60c01', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3510', 'success', '2025-10-05 06:47:53.312908+00', NULL, '2025-10-05 06:47:53.312908+00'),
	('ba8d36f9-6c13-4b67-9a64-64b81f63233a', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3515', 'success', '2025-10-05 06:47:53.329873+00', NULL, '2025-10-05 06:47:53.329873+00'),
	('4c909c34-57b2-45a6-84d9-5ad27875f082', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3527', 'success', '2025-10-05 06:47:53.354523+00', NULL, '2025-10-05 06:47:53.354523+00'),
	('43ce5ee2-5cd6-4f54-9a17-dafc28671fb8', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3530', 'success', '2025-10-05 06:47:53.373628+00', NULL, '2025-10-05 06:47:53.373628+00'),
	('f2f19012-438c-458b-a838-217365aef1c0', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3534', 'success', '2025-10-05 06:47:53.391385+00', NULL, '2025-10-05 06:47:53.391385+00'),
	('ed8c5b79-9676-4823-8468-f31e434c31cb', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3536', 'success', '2025-10-05 06:47:53.422443+00', NULL, '2025-10-05 06:47:53.422443+00'),
	('00b68b44-1055-4c77-b00f-dc30c37c13ac', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3538', 'success', '2025-10-05 06:47:53.439512+00', NULL, '2025-10-05 06:47:53.439512+00'),
	('c3b91834-83e8-4bdb-a1c7-7154c8c6f3d4', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3540', 'success', '2025-10-05 06:47:53.456726+00', NULL, '2025-10-05 06:47:53.456726+00'),
	('95df0c5f-a828-4a2d-860e-b3e7b642409e', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3542', 'success', '2025-10-05 06:47:53.472776+00', NULL, '2025-10-05 06:47:53.472776+00'),
	('1fada7eb-4f29-411b-b1ba-4dd3c0d28494', 'e28bfa9f-bd58-42c6-b0eb-19b3c7667969', 'people', '3544', 'success', '2025-10-05 06:47:53.488503+00', NULL, '2025-10-05 06:47:53.488503+00'),
	('eec05dc7-da90-4f83-b3cf-909142599fc3', '201861a9-035a-4d40-a7ff-4adb27972d2b', 'people', '884', 'success', '2025-10-05 06:49:21.159273+00', NULL, '2025-10-05 06:49:21.159273+00');


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

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") VALUES
	('24fa29f4-6c4e-4bf8-b632-d1dc769520b7', 'people-images', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0/image/image_884_1759646961685.png', NULL, '2025-10-05 06:49:21.126987+00', '2025-10-05 06:49:21.126987+00', '2025-10-05 06:49:21.126987+00', '{"eTag": "\"e357ee101fffeef672f09105c4e2f607\"", "size": 13333, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-05T06:49:21.100Z", "contentLength": 13333, "httpStatusCode": 200}', 'e00efa93-9a3e-4b65-94c1-9b561105eec4', NULL, '{}', 3);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") VALUES
	('people-images', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2025-10-05 06:49:21.126987+00', '2025-10-05 06:49:21.126987+00'),
	('people-images', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0/image', '2025-10-05 06:49:21.126987+00', '2025-10-05 06:49:21.126987+00');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 4, true);


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

-- \unrestrict 9oygkLY78fbJ72Atd3ZAWCFgWvNRh8OzWP4FG7jdLKFhMJfGpTS26WUuSaG3GCD

RESET ALL;
