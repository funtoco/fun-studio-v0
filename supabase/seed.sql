SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 8Cq5hN3ZgFBpQNdKeiKAmoOxnadL0hov6AImnZRkt4mRzFJYgvnlJf0vE2uvhee

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
	('00000000-0000-0000-0000-000000000000', '5c7bfded-8528-4edf-807e-ce34462d0582', '{"action":"login","actor_id":"8e655bd3-a6fd-430e-8301-d6e842d997e6","actor_username":"tomoaki.nishimura@funtoco.jp","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-05 00:56:41.017457+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8e655bd3-a6fd-430e-8301-d6e842d997e6', 'authenticated', 'authenticated', 'tomoaki.nishimura@funtoco.jp', '$2a$10$e0Gu/gitGrBm2g3BCWCy0OPc2mBKYX55ftJU6CXMsuaQgZbnHijsS', '2025-10-04 11:55:12.491398+00', NULL, '', '2025-10-04 11:55:02.636605+00', '', NULL, '', '', NULL, '2025-10-05 00:56:41.01884+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8e655bd3-a6fd-430e-8301-d6e842d997e6", "email": "tomoaki.nishimura@funtoco.jp", "tenant_id": "1c5a22c7-ca7c-4db7-9509-d91aff15aee0", "tenant_name": "柏原マルタマフーズ株式会社", "email_verified": true, "phone_verified": false}', NULL, '2025-10-04 11:55:02.625646+00', '2025-10-05 00:56:41.023148+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


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
	('a329eea5-3d39-4a61-86e1-fe6efd50daab', '8e655bd3-a6fd-430e-8301-d6e842d997e6', '2025-10-05 00:56:41.018885+00', '2025-10-05 00:56:41.018885+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ab70a677-b613-422d-af08-eb5d1d4e4249', '2025-10-04 11:55:12.984724+00', '2025-10-04 11:55:12.984724+00', 'email/signup', 'd0da480b-145c-408d-8b76-ea4f14ff9452'),
	('a329eea5-3d39-4a61-86e1-fe6efd50daab', '2025-10-05 00:56:41.023658+00', '2025-10-05 00:56:41.023658+00', 'password', '20aa6639-193c-4e88-bf84-462677cc9f85');


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
	('00000000-0000-0000-0000-000000000000', 3, 'qtwdmv2zydy6', '8e655bd3-a6fd-430e-8301-d6e842d997e6', false, '2025-10-05 00:56:41.020499+00', '2025-10-05 00:56:41.020499+00', NULL, 'a329eea5-3d39-4a61-86e1-fe6efd50daab');


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
	('e68b03c9-d87c-4ae3-845e-fa1be690ca92', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'kintone', 'Kintone (funtoco)', '2025-10-05 00:57:11.880333+00', '2025-10-05 00:57:11.880333+00');


--
-- Data for Name: connection_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connection_status" ("id", "connector_id", "status", "last_error", "updated_at") VALUES
	('74cdd9a1-fc6c-4c22-83c1-f48a551eb3c8', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'error', 'Sync completed with 1 errors', '2025-10-05 01:50:00.689+00');


--
-- Data for Name: connector_app_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_app_mappings" ("id", "connector_id", "source_app_id", "source_app_name", "target_app_type", "is_active", "created_at", "updated_at") VALUES
	('517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '13', 'Kintone app 13', 'people', true, '2025-10-05 00:57:58.3974+00', '2025-10-05 01:50:22.993585+00');


--
-- Data for Name: connector_app_filters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_app_filters" ("id", "connector_id", "app_mapping_id", "field_code", "field_name", "field_type", "filter_value", "is_active", "created_at", "updated_at") VALUES
	('f4dbd146-a51d-444a-a498-aee2f0a3b9b1', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'COID', '法人ID', 'NUMBER', '2787', true, '2025-10-05 00:57:59.458564+00', '2025-10-05 00:57:59.458564+00');


--
-- Data for Name: connector_field_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."connector_field_mappings" ("id", "connector_id", "app_mapping_id", "source_field_id", "source_field_code", "source_field_name", "source_field_type", "target_field_id", "target_field_code", "target_field_name", "target_field_type", "is_required", "is_active", "sort_order", "created_at", "updated_at", "is_update_key") VALUES
	('9c2bdd16-e43a-4f46-84e5-0113ac9e7495', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', '$id', '$id', '$id', 'UNKNOWN', 'id', 'id', NULL, NULL, false, true, 0, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', true),
	('b538a191-5f76-490f-80be-a93c0543b301', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'name', 'name', '人材名', 'SINGLE_LINE_TEXT', 'name', 'name', NULL, NULL, false, true, 1, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('bc2dd9b4-ead1-45be-b0b9-3194f6cc7bb5', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'HRID', 'HRID', '人材ID', 'NUMBER', 'external_id', 'external_id', NULL, NULL, false, true, 2, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('5849a562-cb84-49c8-84a6-ae3104b4fcb9', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'furigana', 'furigana', '呼び名（フリガナ）', 'SINGLE_LINE_TEXT', 'kana', 'kana', NULL, NULL, false, true, 3, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('3a6aeae2-046f-4260-b416-63891760f504', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'country', 'country', '国籍', 'DROP_DOWN', 'nationality', 'nationality', NULL, NULL, false, true, 4, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('7f41f349-b124-43ba-84dc-3d80450c77d2', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'dateOfBirth', 'dateOfBirth', '生年月日', 'DATE', 'dob', 'dob', NULL, NULL, false, true, 5, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('190fd40d-e110-433a-92a7-ee2cbfe64233', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'phoneNumber', 'phoneNumber', '電話番号', 'SINGLE_LINE_TEXT', 'phone', 'phone', NULL, NULL, false, true, 6, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('8ac55d45-e29a-42ca-bfab-f66731bf6659', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'address', 'address', '住所', 'SINGLE_LINE_TEXT', 'address', 'address', NULL, NULL, false, true, 7, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('d25d7ebd-2c57-4dce-9885-a2211898956c', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'workingStatus', 'workingStatus', '就労ステータス (営業のみ)', 'DROP_DOWN', 'working_status', 'working_status', NULL, NULL, false, true, 8, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('4fd7fd34-bbf2-4a57-a0a7-6bdbff45a003', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'latestResidenceCardNo', 'latestResidenceCardNo', '在留カード番号', 'SINGLE_LINE_TEXT', 'residence_card_no', 'residence_card_no', NULL, NULL, false, true, 9, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false),
	('04f51859-3cff-4cf5-85fa-a26b31e93a18', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', '517d3ebd-b9ef-45bc-9765-400c5b6059ad', 'latestResidenceCardExpirationDate', 'latestResidenceCardExpirationDate', '在留期限', 'DATE', 'residence_card_expiry_date', 'residence_card_expiry_date', NULL, NULL, false, true, 10, '2025-10-05 01:48:09.469777+00', '2025-10-05 01:48:09.469777+00', false);


--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."credentials" ("id", "connector_id", "type", "payload_encrypted", "created_at", "updated_at", "format", "payload") VALUES
	('5de3ec4d-fd6b-4cc1-9b49-9c4a4cb8cf59', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'kintone_config', NULL, '2025-10-05 00:57:11.889092+00', '2025-10-05 00:57:11.889092+00', 'plain', '{"domain":"https://funtoco.cybozu.com","clientId":"l.1.sjxcgeg6zxdo1i267m57ss4r8gzti2go","clientSecret":"max0pn4pwxxhun6rh7z76dv7360ai7dkz9fqg9nu07l9tk7n55z7jntnk4ko5alw","scope":["k:app_record:read","k:app_settings:read"]}'),
	('dcca6b3e-9b07-4306-9957-4bb2a9ba745a', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'kintone_token', NULL, '2025-10-05 00:57:14.316864+00', '2025-10-05 00:57:21.081+00', NULL, '{"access_token":"1.2Y3CC2vphnEaVBEgbVg_yDFSTBjhsGxDwJyh9deg8L-_UGXh","refresh_token":"1.DtK4XXms_GaUlLZ1d-yeu1W80uhJ5Q0R3Jg2FxhzrAJC288K","expires_at":1759629441077,"scope":"k:app_record:read k:app_settings:read"}');


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenants" ("id", "name", "slug", "description", "settings", "max_members", "created_at", "updated_at") VALUES
	('1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '柏原マルタマフーズ株式会社', '', '柏原マルタマフーズ株式会社のテナント', '{}', 50, '2025-10-04 11:55:03.238967+00', '2025-10-04 11:55:03.238967+00');


--
-- Data for Name: people; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."people" ("id", "name", "kana", "nationality", "dob", "phone", "email", "address", "company", "note", "visa_id", "created_at", "updated_at", "employee_number", "working_status", "specific_skill_field", "residence_card_no", "residence_card_expiry_date", "residence_card_issued_date", "tenant_id", "external_id") VALUES
	('505', 'SHERPA SUVASH', 'スバス', 'ネパール', '1996-12-12', '080-9657-5095', NULL, '大阪府河内長野市中片添町40番7 302号', NULL, NULL, NULL, '2025-10-05 01:50:26.238+00', '2025-10-05 01:50:26.178541+00', NULL, '在籍中', NULL, 'SA76754253LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '862'),
	('506', 'BAL RUJIT', 'ルジト', 'ネパール', '1998-08-03', '080-7996-1962', NULL, '大阪府大阪狭山市東池尻5丁目1301番地の2-103号', NULL, NULL, NULL, '2025-10-05 01:50:26.246+00', '2025-10-05 01:50:26.186742+00', NULL, '在籍中', NULL, 'SA84060007LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '863'),
	('507', 'TAMANG RAJU', 'ラズ', 'ネパール', '1993-11-20', '080-9427-5612', NULL, '大阪府堺市西区浜寺船尾町西5-5-2 レオパレス浜寺ドット輝106', NULL, NULL, NULL, '2025-10-05 01:50:26.252+00', '2025-10-05 01:50:26.192485+00', NULL, '在籍中', NULL, 'SAJ6121434LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '864'),
	('509', 'BHANDARI OBARAM', 'オバラム', 'ネパール', '1993-12-07', '080-7624-9113', NULL, '大阪府八尾市東山本新町2丁目6番10  レオパレス東山本 102', NULL, NULL, NULL, '2025-10-05 01:50:26.266+00', '2025-10-05 01:50:26.205433+00', NULL, '在籍中', NULL, 'SA13321720LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '866'),
	('512', 'GAUCHAN ROSHAN', 'ロサン ', 'ネパール', '1993-05-05', NULL, NULL, '大阪府堺市東区草尾385-1 レオパレス登美丘105', NULL, NULL, NULL, '2025-10-05 01:50:26.281+00', '2025-10-05 01:50:26.221821+00', NULL, '在籍中', NULL, 'SA26935760LA', '2025-12-02', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '869'),
	('514', 'ASHIM KHADKA', 'アシム', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.293+00', '2025-10-05 01:50:26.232286+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '871'),
	('515', 'BIKRAN BASNET', 'ビクラン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.298+00', '2025-10-05 01:50:26.237383+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '872'),
	('517', 'MAGAR SURESH', 'スレス', 'ネパール', '1995-08-21', '070-3357-7615', NULL, '大阪府大阪市平野区加美正覚寺３丁目７−２３レオパレスヴィヴレII  205', NULL, NULL, NULL, '2025-10-05 01:50:26.309+00', '2025-10-05 01:50:26.248404+00', NULL, '在籍中', NULL, 'SA78814312LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '874'),
	('519', 'THING RAJ KUMAR', 'ラジ ', 'ネパール', '1991-11-12', '080-7949-5338', NULL, '大阪府門真市堂山町3-19-104号', NULL, NULL, NULL, '2025-10-05 01:50:26.321+00', '2025-10-05 01:50:26.261147+00', NULL, '在籍中', NULL, 'SA93788779LA', '2025-12-02', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '876'),
	('522', 'GC DAMODAR', 'ダモダル', 'ネパール', '1987-01-06', '070-3192-2622', NULL, '奈良県葛城市西辻179-1 レスポワールC棟203', NULL, NULL, NULL, '2025-10-05 01:50:26.34+00', '2025-10-05 01:50:26.280975+00', NULL, '在籍中', NULL, 'UH02404443LA', '2026-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '879'),
	('525', 'SHRESTHA DINESH', 'ディネス', 'ネパール', '1997-03-03', '080-4421-4674', NULL, '兵庫県西宮市甲子園口5丁目13番37−304号', NULL, NULL, NULL, '2025-10-05 01:50:26.359+00', '2025-10-05 01:50:26.299127+00', NULL, '在籍中', NULL, 'SA20649250LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '882'),
	('1045', 'AUNG KO HTWE', 'アウン', 'ミャンマー', '2000-05-13', '090-5305-8926', NULL, '大阪府大東市北条1-6-1レオパレス野崎参道203', NULL, NULL, NULL, '2025-10-05 01:50:26.381+00', '2025-10-05 01:50:26.320349+00', NULL, '在籍中', NULL, 'UH83804573LA', '2026-04-16', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1099'),
	('1048', 'AUNG SOE NAING', 'アウン', 'ミャンマー', '1996-07-07', '080-1156-9499', NULL, '大阪府門真市大倉町24-22レオパレスラフレシール302', NULL, NULL, NULL, '2025-10-05 01:50:26.39+00', '2025-10-05 01:50:26.329522+00', NULL, '在籍中', NULL, 'UH55263939LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1102'),
	('1051', 'KYAW THURA', 'チョー', 'ミャンマー', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.401+00', '2025-10-05 01:50:26.341038+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1105'),
	('1054', 'MYO MIN THANT', 'ミョー', 'ミャンマー', '2002-05-08', '080-9993-9579', NULL, '和歌山県新宮市五新5番10 メゾンなんかい2階建  203', NULL, NULL, NULL, '2025-10-05 01:50:26.412+00', '2025-10-05 01:50:26.351389+00', NULL, '在籍中', NULL, 'UH05364599LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1108'),
	('1058', 'PHYO KHANT KYAW', 'ピョー', 'ミャンマー', '2004-04-10', '080-7848-5684', NULL, '奈良県御所市東辻33-11エスポワールA202号室', NULL, NULL, NULL, '2025-10-05 01:50:26.426+00', '2025-10-05 01:50:26.366482+00', NULL, '在籍中', NULL, 'UH68241793LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1112'),
	('1064', 'ZAW MIN OO', 'ゾー', 'ミャンマー', '1998-06-10', '090-4135-2268', NULL, '奈良県香芝市北今市2-276-1レオネクストエクレール北今市202号室', NULL, NULL, NULL, '2025-10-05 01:50:26.438+00', '2025-10-05 01:50:26.37781+00', NULL, '在籍中', NULL, 'UH76968666LA', '2026-04-24', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1118'),
	('1071', 'NAY HTET LIN', 'ネー', 'ミャンマー', '2005-05-12', '070-2806-1048', NULL, '奈良県北葛城郡上牧町中筋出作15ロイヤルガーデン上牧B303', NULL, NULL, NULL, '2025-10-05 01:50:26.456+00', '2025-10-05 01:50:26.395534+00', NULL, '在籍中', NULL, 'UH52304157LA', '2026-04-24', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1125'),
	('1074', 'SOE MIN THU', 'ミン', 'ミャンマー', '2005-02-02', '090-5304-1858', NULL, '大阪府門真市小路町3番2- 104号', NULL, NULL, NULL, '2025-10-05 01:50:26.466+00', '2025-10-05 01:50:26.40615+00', NULL, '在籍中', NULL, 'UH54075018LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1128'),
	('1129', 'WAI YAN HTAY', 'ウェイヤン', 'ミャンマー', '1999-01-14', '070-2633-0201', NULL, '鳥取県米子市皆生温泉1丁目３番63-206号', NULL, NULL, NULL, '2025-10-05 01:50:26.489+00', '2025-10-05 01:50:26.428397+00', NULL, '在籍中', NULL, 'UH84029016LA', '2026-04-24', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1129'),
	('2683', 'KHANT ZAYAR WIN', 'カン', 'ミャンマー', '2003-05-18', '080-2157-3675', NULL, '大阪府藤井寺市川北３丁目４−２３', NULL, NULL, NULL, '2025-10-05 01:50:26.499+00', '2025-10-05 01:50:26.438665+00', NULL, '退職', NULL, 'SA02016019MA', '2025-10-28', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1714'),
	('2685', 'MIN HTUN', 'ミン', 'ミャンマー', '1998-02-10', '080-2033-7397', NULL, '大阪府貝塚市三ツ松745-1 レオパレスサンエイ202号', NULL, NULL, NULL, '2025-10-05 01:50:26.51+00', '2025-10-05 01:50:26.450204+00', NULL, '在籍中', NULL, 'UH14638645EA', '2026-10-28', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1716'),
	('2872', 'ADHIKARI BHESHRAJ', 'べシーラジ', 'ネパール', '1995-04-22', '07043869357', NULL, '大阪府門真市浜町11−18 レオパレスナカトミ 201号', NULL, NULL, NULL, '2025-10-05 01:50:26.527+00', '2025-10-05 01:50:26.467288+00', NULL, '在籍中', NULL, 'UH61979059MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1893'),
	('2874', 'LOPCHAN SUMAN', 'スーマン', 'ネパール', '1998-09-09', '08010438017', NULL, '滋賀県守山市二町町215-3 レオパレストルマリン 201号', NULL, NULL, NULL, '2025-10-05 01:50:26.538+00', '2025-10-05 01:50:26.478753+00', NULL, '在籍中', NULL, 'UH81266611MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1895'),
	('2877', 'RAI DHAN RAJ', 'ラージ', 'ネパール', '2003-07-19', '08085228159', NULL, '奈良県御所市三室532-1 ルーチェみむろ 206', NULL, NULL, NULL, '2025-10-05 01:50:26.555+00', '2025-10-05 01:50:26.494849+00', NULL, '在籍中', NULL, 'UH28412482MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1898'),
	('2879', 'BOHARA HARISH', 'ハリッシ', 'ネパール', '1998-05-12', '‪+81 80‑2587‑9068‬', NULL, '奈良県葛城市西辻179-1レスポワールC 棟203', NULL, NULL, NULL, '2025-10-05 01:50:26.567+00', '2025-10-05 01:50:26.506562+00', NULL, '在籍中', NULL, 'UH01994529MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1900'),
	('2882', 'SAUD SHYAM', 'シャム', 'ネパール', '2001-10-06', '09074978104', NULL, '京都府京都市左京区岩倉花園町１２５−１ レオパレス花園 212', NULL, NULL, NULL, '2025-10-05 01:50:26.585+00', '2025-10-05 01:50:26.524467+00', NULL, '在籍中', NULL, 'UH56826705MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1903'),
	('2884', 'NAGARKOTI BISHNU', 'ビスヌ', 'ネパール', '1996-02-13', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.594+00', '2025-10-05 01:50:26.533212+00', NULL, '内定辞退', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1905'),
	('2886', 'GURUNG SAMPURNA', 'サンプルナ', 'ネパール', '1998-07-15', '08085185239', NULL, '大阪府藤井寺市川北3-4-23ー301号', NULL, NULL, NULL, '2025-10-05 01:50:26.604+00', '2025-10-05 01:50:26.544168+00', NULL, '在籍中', NULL, 'UH22298176MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1907'),
	('2891', 'NAING HTET SOE', 'ソー', 'ミャンマー', '2004-05-10', '090-7095-1492', NULL, '奈良県五條市釜窪町１４８−２ 余慶マンション1２号', NULL, NULL, NULL, '2025-10-05 01:50:26.619+00', '2025-10-05 01:50:26.559376+00', NULL, '在籍中', NULL, 'UH20607494MA', '2026-01-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1912'),
	('2894', 'THANT ZIN LIN', 'リン', 'ミャンマー', '2001-04-06', '090-3495-6248', NULL, '和歌山県紀の川市打田19-4 レオパレスアリスⅡ110号室', NULL, NULL, NULL, '2025-10-05 01:50:26.637+00', '2025-10-05 01:50:26.576582+00', NULL, '退職', NULL, 'UH21512426MA', '2026-01-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1915'),
	('2898', 'YE YINT KYAW', 'チョー', 'ミャンマー', '2004-04-07', '090-5614-2469', NULL, '奈良県北葛城郡王寺町畠田4丁目12番11-202号', NULL, NULL, NULL, '2025-10-05 01:50:26.653+00', '2025-10-05 01:50:26.593632+00', NULL, '在籍中', NULL, 'UH33941211MA', '2026-01-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1919'),
	('2911', 'ZAR NI TUN', 'トゥン', 'ミャンマー', '2000-03-27', '080-8897-3705', NULL, '大阪府松原市岡３丁目８番１ レオパレスサウスヒルズM&M １０６号', NULL, NULL, NULL, '2025-10-05 01:50:26.667+00', '2025-10-05 01:50:26.606442+00', NULL, '在籍中', NULL, ' UH81634923LA', '2026-01-10', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1888'),
	('3046', 'THOKAR ANISH', 'アニス', 'ネパール', '1997-04-14', '070-9095-4721', NULL, '大阪府和泉市葛の葉町1-14-28 レオパレススルーク 107', NULL, NULL, NULL, '2025-10-05 01:50:26.683+00', '2025-10-05 01:50:26.622282+00', NULL, '在籍中', NULL, 'UH20129835LA', '2026-04-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2114'),
	('504', 'BHUJEL SURYA BAHADUR', 'スルヤ', 'ネパール', '2002-09-20', NULL, NULL, '和歌山県橋本市神野々877-1', NULL, NULL, NULL, '2025-10-05 01:50:26.227+00', '2025-10-05 01:50:26.169289+00', NULL, '退職', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '861'),
	('508', 'THAPA DIPAK', 'ディパク', 'ネパール', '1992-02-07', '080-7370-6873', NULL, '大阪府大阪市住吉区長居東 1-14-22-201号', NULL, NULL, NULL, '2025-10-05 01:50:26.258+00', '2025-10-05 01:50:26.198717+00', NULL, '在籍中', NULL, 'SA53757228LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '865'),
	('510', 'SHERPA ANG DAMI', 'アンダミ', 'ネパール', '1998-05-27', '080-9436-3916', NULL, '大阪府堺市美原区多治井86番地1レオネクスト美原野元102', NULL, NULL, NULL, '2025-10-05 01:50:26.271+00', '2025-10-05 01:50:26.210754+00', NULL, '在籍中', NULL, 'SA01921012LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '867'),
	('511', 'KUNWAR ROSHAN', 'ロサン ', 'ネパール', '1995-10-08', '080-4936-1416', NULL, '大阪府河内長野市中片添町40番7-302号', NULL, NULL, NULL, '2025-10-05 01:50:26.276+00', '2025-10-05 01:50:26.215731+00', NULL, '在籍中', NULL, 'SA69138948LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '868'),
	('513', 'BHANDARI LAXMAN', 'ラクスマン', 'ネパール', '1997-04-15', '080-4891-1829', NULL, '大阪府堺市西区鳳北町8丁453番地10  ファーウッド305号', NULL, NULL, NULL, '2025-10-05 01:50:26.287+00', '2025-10-05 01:50:26.227351+00', NULL, '在籍中', NULL, 'SA04404266LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '870'),
	('516', 'BHANDARI RAJ', 'ラジュ', 'ネパール', '1999-01-31', '080-7164-9646', NULL, '大阪府堺市西区鳳北町8丁453番地10  ファーウッド304号', NULL, NULL, NULL, '2025-10-05 01:50:26.304+00', '2025-10-05 01:50:26.243706+00', NULL, '在籍中', NULL, 'SA32372707LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '873'),
	('518', 'PUN KRISHNA BAHADUR', 'クリスナ', 'ネパール', '1989-02-25', '080-7519-8720', NULL, '大阪府和泉市上町361番地2レオパレスセレザ210', NULL, NULL, NULL, '2025-10-05 01:50:26.314+00', '2025-10-05 01:50:26.254802+00', NULL, '在籍中', NULL, 'SA70116477LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '875'),
	('520', 'THAPA DHAN BAHADUR', 'ダン ', 'ネパール', '1992-10-04', '070-3151-6835', NULL, '奈良県北葛城郡上牧町大字中筋出作15-2 ロイヤルガーデン上牧A-303', NULL, NULL, NULL, '2025-10-05 01:50:26.326+00', '2025-10-05 01:50:26.266019+00', NULL, '在籍中', NULL, 'SA28640988LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '877'),
	('521', 'BAL KARAN', 'カラン', 'ネパール', '1992-10-28', '070-3263-3918', NULL, '奈良県葛城市西辻179-1 レスポワールC棟203', NULL, NULL, NULL, '2025-10-05 01:50:26.331+00', '2025-10-05 01:50:26.271865+00', NULL, '在籍中', NULL, 'SA01944592LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '878'),
	('523', 'BASKOTA NAKUL', 'ナクル', 'ネパール', '1999-12-14', '080-7362-3138', NULL, '大阪府堺市東区草尾385番地1 レオパレス登美丘103号', NULL, NULL, NULL, '2025-10-05 01:50:26.347+00', '2025-10-05 01:50:26.287127+00', NULL, '支援終了', NULL, 'UH03769430LA', '2026-08-14', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '880'),
	('524', 'KHADKA RAJESH', 'ラジェス', 'ネパール', '2000-10-18', '080-7373-2585', NULL, '奈良県葛城市西辻179番地1レスポワールC棟203号', NULL, NULL, NULL, '2025-10-05 01:50:26.353+00', '2025-10-05 01:50:26.293802+00', NULL, '退職', NULL, 'NP20766724LA', '2024-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '881'),
	('526', 'GOLE BIKMAN', 'ビクマン', 'ネパール', '1994-08-02', '080-9425-7155', NULL, '大阪府和泉市上町361番地の2（レオパレスセレザ208号）', NULL, NULL, NULL, '2025-10-05 01:50:26.365+00', '2025-10-05 01:50:26.304652+00', NULL, '在籍中', NULL, 'SA00812091LA', '2025-11-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '883'),
	('527', 'KHATRI SANJIB', 'サンジブ', 'ネパール', '1992-03-05', '07018475982', NULL, '鳥取県米子市皆生温泉1-3-63 レオパレスさつき　205号', NULL, NULL, NULL, '2025-10-05 01:50:26.37+00', '2025-10-05 01:50:26.310129+00', NULL, '在籍中', NULL, 'SA97179012LA', '2025-12-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '884'),
	('1043', 'TIN MYO WIN', 'ウィン', 'ミャンマー', '2003-04-09', '070-2823-2700', NULL, '大阪府大阪市東住吉区矢田4-10-23レオパレスNORTHV303', NULL, NULL, NULL, '2025-10-05 01:50:26.376+00', '2025-10-05 01:50:26.31565+00', NULL, '在籍中', NULL, 'UH13446762LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1097'),
	('1046', 'AUNG KO ZIN', 'アウンコ', 'ミャンマー', '2000-11-19', '090-5305-9390', NULL, '大阪府門真市大倉町24-22レオパレスラフレシール301', NULL, NULL, NULL, '2025-10-05 01:50:26.385+00', '2025-10-05 01:50:26.325053+00', NULL, '在籍中', NULL, 'UH38899544LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1100'),
	('2887', 'SHERPA NGIMA ', 'セルパ', 'ネパール', '2005-02-07', '09051280436', NULL, '兵庫県尼崎市西立花町２−１５−７ レオパレスシルク立花 104', NULL, NULL, NULL, '2025-10-05 01:50:26.609+00', '2025-10-05 01:50:26.548837+00', NULL, '在籍中', NULL, 'UH52294517MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1908'),
	('3140', 'TAMANG SUNITA', 'スニタ', 'ネパール', '1999-08-26', '080-6384-8642', NULL, '鳥取県米子市皆生温泉1-3-63 レオパレスさつき　205号', NULL, NULL, NULL, '2025-10-05 01:50:26.697+00', '2025-10-05 01:50:26.636994+00', NULL, '在籍中', NULL, 'UH82667195LA', '2026-06-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2178'),
	('3154', 'GHARTI DICTION', 'ディクション', 'ネパール', '1997-05-22', '0729720568', NULL, '大阪府河内長野市北青葉台1-14 グリーンハイツ芝Ⅰ 201', NULL, NULL, NULL, '2025-10-05 01:50:26.715+00', '2025-10-05 01:50:26.654686+00', NULL, '在籍中', NULL, 'UH29214537MA', '2026-09-16', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2273'),
	('3155', 'THIN YU MON', 'ユ', 'ミャンマー', '1996-04-16', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.72+00', '2025-10-05 01:50:26.659402+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2290'),
	('3245', 'CHALAUNE HEM RAJ', 'シャラウネ', 'ネパール', '2001-05-28', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.736+00', '2025-10-05 01:50:26.675692+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2429'),
	('3246', 'SAPKOTA KRISHAL', 'サプコタ', 'ネパール', '2006-07-04', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.741+00', '2025-10-05 01:50:26.681058+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2430'),
	('3247', 'GHARTIMAGAR MEGH RAJ', 'ガルティ', 'ネパール', '1991-03-15', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.747+00', '2025-10-05 01:50:26.687028+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2431'),
	('3248', 'TAMANG TARA BAHADUR', 'タマン', 'ネパール', '1989-11-26', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.752+00', '2025-10-05 01:50:26.691867+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2432'),
	('3410', 'HTOO NAW LINN', 'リン', 'ミャンマー', '2003-03-29', '070-8526-4055', NULL, '京都府京都市中京区姉西洞院町529 アブレスト西洞院3B', NULL, NULL, NULL, '2025-10-05 01:50:26.769+00', '2025-10-05 01:50:26.708944+00', NULL, '入社待ち', NULL, 'SA78276813MA', '2025-09-17', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2574'),
	('3413', 'BHANDARI LILADHAR', 'リラダル', 'ネパール', '1989-07-14', '07085077553', NULL, '鹿児島県南九州市頴娃町牧之内2985番地1', NULL, NULL, NULL, '2025-10-05 01:50:26.799+00', '2025-10-05 01:50:26.740515+00', NULL, '入社待ち', NULL, 'UH85902605FA', '2026-05-16', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2626'),
	('3414', 'KHANAL KIRAN', 'キラン', 'ネパール', '2003-04-19', '070-9204-7275', NULL, '茨城県鉾田市造谷1375番地322', NULL, NULL, NULL, '2025-10-05 01:50:26.81+00', '2025-10-05 01:50:26.763067+00', NULL, '入社待ち', NULL, 'UH08937440FA', '2026-02-02', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2623'),
	('3509', 'KHAING THAZIN', 'カイ', 'ミャンマー', '1996-05-20', '070-8941-6010', NULL, '福岡県福津市花見が丘1-12-5レオパレス花見が丘K.M108', NULL, NULL, NULL, '2025-10-05 01:50:26.843+00', '2025-10-05 01:50:26.781968+00', NULL, '入社待ち', NULL, 'SA38679145EA', '2025-11-21', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2654'),
	('3515', 'RANEPURA KANKANAM KANATHTHAGE SUMEDA', 'スメーダー', 'スリランカ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.855+00', '2025-10-05 01:50:26.793656+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2673'),
	('3526', 'THARU PRABIN', 'パルビン', 'ネパール', '1999-12-01', '09054311188', NULL, '東京都江戸川区篠崎町6-3-12 カーサ グランデイー ル 210番', NULL, NULL, NULL, '2025-10-05 01:50:26.86+00', '2025-10-05 01:50:26.799101+00', NULL, '入社待ち', NULL, 'UH655071116EA', '2026-03-25', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2675'),
	('3527', 'CHAUDHARY RUMAN', 'ルマン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.864+00', '2025-10-05 01:50:26.803693+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2684'),
	('3530', 'BOKATI MUKESH BAHADUR', 'ムケシュ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.873+00', '2025-10-05 01:50:26.812846+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2688'),
	('3533', 'DHAMALA LAXMAN PASAD', 'ダマラ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.877+00', '2025-10-05 01:50:26.816362+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2690'),
	('3535', 'JOSHI SAROJ', 'サロジ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.885+00', '2025-10-05 01:50:26.824426+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2692'),
	('3536', 'LIMBU SINGYUK', 'シンユク', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.89+00', '2025-10-05 01:50:26.829082+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2693'),
	('3537', 'MALLA THAKURI ANIL', 'アニル', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.894+00', '2025-10-05 01:50:26.833516+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2694'),
	('3539', 'MASRANGI GOVINDA BAHADUR', 'ゴヴィンダ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.904+00', '2025-10-05 01:50:26.843072+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2696'),
	('3540', 'MUDEL AASHISH', 'アーシッシュ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.908+00', '2025-10-05 01:50:26.847031+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2697'),
	('3542', 'TAMANG RAJMAN', 'ラジマン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.916+00', '2025-10-05 01:50:26.855038+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2699'),
	('3543', 'SHRESTHA HARI BAHADUR', 'ハリ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.921+00', '2025-10-05 01:50:26.860267+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2700'),
	('1049', 'CHAN MIN TUN', 'チャン', 'ミャンマー', '2001-06-25', '080-8714-7754', NULL, '奈良県大和郡山市車町１４−１ レオパレスルオーテ104号室', NULL, NULL, NULL, '2025-10-05 01:50:26.395+00', '2025-10-05 01:50:26.335699+00', NULL, '在籍中', NULL, 'UH59289515LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1103'),
	('1052', 'MIN THU KHAING', 'ミン', 'ミャンマー', '2003-11-09', '070-2806-0067', NULL, '大阪府大阪市住之江区北島２丁目10-10レオパレスAIR101', NULL, NULL, NULL, '2025-10-05 01:50:26.407+00', '2025-10-05 01:50:26.346431+00', NULL, '在籍中', NULL, 'UH14658379LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1106'),
	('1055', 'NAING LIN ZAW', 'ナイン', 'ミャンマー', '2003-03-15', '080-7848-5168', NULL, '和歌山県伊都郡かつらぎ町中飯降1122-1セレノ･カーサB202', NULL, NULL, NULL, '2025-10-05 01:50:26.417+00', '2025-10-05 01:50:26.356231+00', NULL, '在籍中', NULL, 'UH82678102LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1109'),
	('1069', 'YAR ZAR TUN', 'トゥン', 'ミャンマー', '2000-10-30', '070-4416-3347', NULL, '奈良県北葛城郡上牧町中筋出作15ロイヤルガーデン上牧B303号室', NULL, NULL, NULL, '2025-10-05 01:50:26.45+00', '2025-10-05 01:50:26.389541+00', NULL, '在籍中', NULL, 'UH29965295LA', '2026-04-24', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1123'),
	('1073', 'YE HTUT SOE', 'イェ', 'ミャンマー', '1999-10-13', '080-1157-2054', NULL, '大阪府藤井寺市川北3-4-23-311号室 ', NULL, NULL, NULL, '2025-10-05 01:50:26.461+00', '2025-10-05 01:50:26.400945+00', NULL, '在籍中', NULL, 'UH82394729LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1127'),
	('1076', 'YE WUNNA HTUN', 'イェ', 'ミャンマー', '2004-06-25', '080-2671-6440', NULL, '奈良県大和郡山市新町８０５−３ レオパレスSHOW102号室', NULL, NULL, NULL, '2025-10-05 01:50:26.471+00', '2025-10-05 01:50:26.411492+00', NULL, '在籍中', NULL, 'UH00125354LA', '2026-04-24', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1130'),
	('1096', 'MYO MIN HEIN', 'ミョー', 'ミャンマー', '2003-06-15', '090-7943-8720', NULL, '大阪府富田林市川向町レオパレス平和307号室', NULL, NULL, NULL, '2025-10-05 01:50:26.483+00', '2025-10-05 01:50:26.423472+00', NULL, '在籍中', NULL, 'UH98572738LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1151'),
	('2682', 'NYO MIN KHANT', 'カン', 'ミャンマー', '2000-04-15', '090-8882-2221', NULL, '大阪府藤井寺市川北3丁目4-23-311', NULL, NULL, NULL, '2025-10-05 01:50:26.494+00', '2025-10-05 01:50:26.433331+00', NULL, '在籍中', NULL, 'UH12945226EA', '2026-10-28', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1713'),
	('2684', 'ZWE HTET NAING', 'ズェ', 'ミャンマー', '2002-06-16', '080-2644-6035', NULL, '大阪府大阪市此花区酉島５丁目２番17号レオパレスHaruhi104号室', NULL, NULL, NULL, '2025-10-05 01:50:26.504+00', '2025-10-05 01:50:26.444385+00', NULL, '在籍中', NULL, 'UH82262799EA', '2026-10-28', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1715'),
	('2832', 'KHATRI DEVENDRA', 'カトリ', 'ネパール', '2004-05-12', '070 90593267', NULL, '大阪府大阪市東住吉区住道矢田4丁目13番16号　レオパレス21マツヤ 303号', NULL, NULL, NULL, '2025-10-05 01:50:26.516+00', '2025-10-05 01:50:26.456307+00', NULL, '在籍中', NULL, 'UH59854002MA', '2026-01-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1831'),
	('2876', 'TAMANG SHYAM', 'シャム', 'ネパール', '2003-05-20', '+819051248355', NULL, '大阪府藤井寺市川北3-4-23　308号', NULL, NULL, NULL, '2025-10-05 01:50:26.55+00', '2025-10-05 01:50:26.48963+00', NULL, '在籍中', NULL, 'UH67418614MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1897'),
	('2878', 'BOHARA KESHAB BAHADUR', 'バハドゥル', 'ネパール', '1994-05-29', '09051248201', NULL, '奈良県北葛城郡上牧町上牧537-1ボヌール202', NULL, NULL, NULL, '2025-10-05 01:50:26.56+00', '2025-10-05 01:50:26.500579+00', NULL, '在籍中', NULL, 'UH06238914MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1899'),
	('2880', 'JOSHI NAVRAJ', 'ナヴラージ', 'ネパール', '1997-11-11', '09050611554', NULL, '兵庫県神戸市垂水区名谷町字北ノ屋敷3044-1　レオパレス北野屋敷206', NULL, NULL, NULL, '2025-10-05 01:50:26.572+00', '2025-10-05 01:50:26.512642+00', NULL, '在籍中', NULL, 'UH19285303MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1901'),
	('2888', 'TAJPURIYA SANJIT KUMAR', 'クマル', 'ネパール', '1994-11-21', '090-5061-0385', NULL, '滋賀県草津市矢倉2-5-31 レオパレスＧＲＥＥＮ　ＣＯＡＴ 201', NULL, NULL, NULL, '2025-10-05 01:50:26.614+00', '2025-10-05 01:50:26.553814+00', NULL, '在籍中', NULL, 'UH32154013MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1909'),
	('2892', 'AUNG CHAN PHYO', 'アウン', 'ミャンマー', '2002-06-13', '090-3495-3294', NULL, '奈良県橿原市葛本町830-1レオパレ スポムール栄延207', NULL, NULL, NULL, '2025-10-05 01:50:26.625+00', '2025-10-05 01:50:26.565107+00', NULL, '在籍中', NULL, 'UH61361035MA', '2026-01-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1913'),
	('2896', 'HTUN YAN', 'トン', 'ミャンマー', '2003-02-28', '090-4868-4347', NULL, '奈良県北葛城郡上牧町中筋出作15-7ロイヤルガーデン上牧A303', NULL, NULL, NULL, '2025-10-05 01:50:26.648+00', '2025-10-05 01:50:26.587831+00', NULL, '在籍中', NULL, 'UH22287582MA', '2026-01-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1917'),
	('2902', 'AUNG THET PAING HMUE', 'アウン', 'ミャンマー', '1995-06-18', '09041353837', NULL, '大阪府大阪市城東区野江２丁目14-6 レオパレスセジュール野江203', NULL, NULL, NULL, '2025-10-05 01:50:26.66+00', '2025-10-05 01:50:26.600251+00', NULL, '在籍中', NULL, 'SA76005785JA', '2025-11-18', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1881'),
	('2912', 'NEPALI LOKENDRA ', 'ロケン', 'ネパール', '1985-05-31', '090- 4421 -1901', NULL, '大阪府和泉市上町361番地の2 （レオパレスセレザ10 5）', NULL, NULL, NULL, '2025-10-05 01:50:26.672+00', '2025-10-05 01:50:26.61134+00', NULL, '在籍中', NULL, 'UH21661134LA', '2026-11-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1932'),
	('3051', 'TAMANG ILAM', 'イラム', 'ネパール', '2002-08-28', '070-9089-3633', NULL, '大阪府河内長野市寿町2-37 レオパレスM&MII　102', NULL, NULL, NULL, '2025-10-05 01:50:26.692+00', '2025-10-05 01:50:26.631895+00', NULL, '在籍中', NULL, 'UH36096164LA', '2026-04-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2122'),
	('3152', 'THAPA DEEPAK', 'ディパク', 'ネパール', '1991-03-04', '09052069274', NULL, '大阪府河内長野市北青葉台1-14 グリーンハイツ芝Ⅰ 201', NULL, NULL, NULL, '2025-10-05 01:50:26.703+00', '2025-10-05 01:50:26.642467+00', NULL, '在籍中', NULL, 'UH20471983MA', '2026-09-16', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2271'),
	('3234', 'CHAPAGAIN RAJESH', 'ラジェシュ', 'ネパール', '2000-08-20', '08015841375', NULL, '大阪府藤井寺市川北3-4-23  309号', NULL, NULL, NULL, '2025-10-05 01:50:26.725+00', '2025-10-05 01:50:26.664923+00', NULL, '在籍中', NULL, 'UH85392858EA', '2026-07-02', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1990'),
	('3249', 'DANGI RAM', 'ダンギ', 'ネパール', '1992-01-09', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.758+00', '2025-10-05 01:50:26.697513+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2433'),
	('3412', 'SALIK RAM ACHARYA', 'サリク', 'ネパール', '1985-12-28', '09085063741', NULL, '大阪府河内長野市寿町２−３７ レオパレスＭ＆ＭⅡ 201 号室', NULL, NULL, NULL, '2025-10-05 01:50:26.792+00', '2025-10-05 01:50:26.732605+00', NULL, '在籍中', NULL, 'UH01781713LA', '2026-09-25', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2372'),
	('3508', 'WINT WAH NAING', 'ウィ ワー', 'ミャンマー', '1998-02-07', '090-4105-9154', NULL, '鹿児島県鹿児島市喜入前之浜町7511番地 ', NULL, NULL, NULL, '2025-10-05 01:50:26.839+00', '2025-10-05 01:50:26.777985+00', NULL, '入社待ち', NULL, 'SA67630462EA', '2025-11-17', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2651'),
	('3510', 'KYI KYI ZAW', 'チー', 'ミャンマー', '2000-06-27', '07091822359', NULL, '京都府京都市中京区小川通六角下る元本能寺町３７７番地ハイツグロース', NULL, NULL, NULL, '2025-10-05 01:50:26.847+00', '2025-10-05 01:50:26.785792+00', NULL, '入社待ち', NULL, 'UH77879453EA', '2026-08-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2642'),
	('3534', 'GURUNG MANISH', 'マニッシュ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.881+00', '2025-10-05 01:50:26.820275+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2691'),
	('3538', 'MALLA KIRAN', 'キラン', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.899+00', '2025-10-05 01:50:26.83844+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2695'),
	('3544', 'SHRESTHA AAKASH', 'アカス', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.926+00', '2025-10-05 01:50:26.866511+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2701'),
	('1056', 'NYEIN CHAN PHYO', 'ニェン', 'ミャンマー', '2000-06-05', '090-4724-7041', NULL, '大阪府大阪市平野区瓜破5-2-31レオパレスきらら201号室', NULL, NULL, NULL, '2025-10-05 01:50:26.422+00', '2025-10-05 01:50:26.361413+00', NULL, '在籍中', NULL, 'UH26285296LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1110'),
	('1061', 'THAW ZIN AUNG', 'アウン', 'ミャンマー', '2001-01-26', '080-8717-1412', NULL, '和歌山県橋本市高野口町伏原レオネクストル・シエル207', NULL, NULL, NULL, '2025-10-05 01:50:26.432+00', '2025-10-05 01:50:26.37163+00', NULL, '在籍中', NULL, 'UH18902177LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1115'),
	('1067', 'PHYO HAN KYAW', 'ピョー', 'ミャンマー', '1999-03-21', '080-2075-5526', NULL, '大阪府大阪市淀川区西中島2-10-23レオパレスルーナ202号室 ', NULL, NULL, NULL, '2025-10-05 01:50:26.443+00', '2025-10-05 01:50:26.384231+00', NULL, '在籍中', NULL, 'UH34409536LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1121'),
	('1094', 'OAK SOE HTUT', 'ソー', 'ミャンマー', '2002-10-13', '070-2632-9855', NULL, '奈良県五條市住川町66番コーポナカイⅡ307号室', NULL, NULL, NULL, '2025-10-05 01:50:26.477+00', '2025-10-05 01:50:26.416896+00', NULL, '在籍中', NULL, 'UH23444393LA', '2026-04-15', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1149'),
	('2871', 'ACHARYA PRADIP', 'プラディプ', 'ネパール', '2001-12-05', '09051302742', NULL, '奈良県北葛城郡上牧町上牧537-1ボヌール202', NULL, NULL, NULL, '2025-10-05 01:50:26.521+00', '2025-10-05 01:50:26.461401+00', NULL, '在籍中', NULL, 'UH01672218MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1892'),
	('2873', 'DHANUK DEBENDRA', 'デべンドラ', 'ネパール', '2002-07-20', '09073696185', NULL, '大阪府大阪市旭区中宮２−７−８ レオパレスＫＫＳ中宮 204号', NULL, NULL, NULL, '2025-10-05 01:50:26.533+00', '2025-10-05 01:50:26.472788+00', NULL, '在籍中', NULL, 'UH54031809MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1894'),
	('2875', 'LAMA JHALAK', 'ジャラク', 'ネパール', '1993-01-18', '09050610745', NULL, '大阪府守口市梶町３−５５−９レオパレス和友  305 号室', NULL, NULL, NULL, '2025-10-05 01:50:26.544+00', '2025-10-05 01:50:26.484819+00', NULL, '在籍中', NULL, 'UH92456338MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1896'),
	('2881', 'LAMA NURBU', 'ヌルブ', 'ネパール', '2003-03-16', '09088493196', NULL, '奈良県御所市三室532-1 ルーチェみむろ 206号', NULL, NULL, NULL, '2025-10-05 01:50:26.578+00', '2025-10-05 01:50:26.518357+00', NULL, '在籍中', NULL, 'UH42130028MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1902'),
	('2883', 'SHAH PADAM', 'パダム', 'ネパール', '2001-08-23', '08025565197', NULL, '兵庫県神戸市北区鈴蘭台南町3-8-9　　レオパレスニシスズラン　101', NULL, NULL, NULL, '2025-10-05 01:50:26.589+00', '2025-10-05 01:50:26.528764+00', NULL, '在籍中', NULL, 'UH54444944MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1904'),
	('2885', 'SYANGTAN DIPENDRA', 'ディペンドラ', 'ネパール', '1997-03-22', '080-8518-5126', NULL, '滋賀県東近江市五個荘竜田町185レオパレス五個荘 206', NULL, NULL, NULL, '2025-10-05 01:50:26.599+00', '2025-10-05 01:50:26.538501+00', NULL, '在籍中', NULL, 'UH56178801MA', '2026-03-13', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1906'),
	('2893', 'PHYO ARKAR', 'ピョー', 'ミャンマー', '2003-05-25', '090-3495-4408', NULL, '奈良県北葛城郡上牧町中筋出作１５−2　ロイヤルガーデン上牧A301号室', NULL, NULL, NULL, '2025-10-05 01:50:26.63+00', '2025-10-05 01:50:26.570962+00', NULL, '在籍中', NULL, 'UH35349727MA', '2026-01-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1914'),
	('2895', 'WAI PHYO AUNG', 'ピョー', 'ミャンマー', '2004-04-22', '080-2644-6254', NULL, '奈良県五條市住川町66 コーポナカイ1   201号室', NULL, NULL, NULL, '2025-10-05 01:50:26.642+00', '2025-10-05 01:50:26.582496+00', NULL, '在籍中', NULL, 'UH57395911MA', '2026-01-29', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1916'),
	('2963', 'GIRI KESHAR', 'ケシャル', 'ネパール', '2000-07-04', '09058787275', NULL, '大阪府大阪市西成区南津守1-1-47 レオパレスプラスパＢ 405', NULL, NULL, NULL, '2025-10-05 01:50:26.677+00', '2025-10-05 01:50:26.617245+00', NULL, '在籍中', NULL, 'UH50143982MA', '2026-04-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '1994'),
	('3047', 'SHYANGBO BIJAY', 'ビザエ', 'ネパール', '1998-02-05', '070-8475-3286', NULL, '大阪府和泉市池上町3-12-17 レオパレスパディーフィールド　102', NULL, NULL, NULL, '2025-10-05 01:50:26.687+00', '2025-10-05 01:50:26.626927+00', NULL, '在籍中', NULL, 'UH22724750LA', '2026-04-01', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2115'),
	('3153', 'BHANDARI DIPAK', 'バンダリ', 'ネパール', '2000-06-15', '08083810097', NULL, '大阪府堺市中区陶器北４０５−１ 207', NULL, NULL, NULL, '2025-10-05 01:50:26.71+00', '2025-10-05 01:50:26.649588+00', NULL, '在籍中', NULL, 'UH42407256MA', '2026-09-16', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2272'),
	('3235', 'AUNG MYAT NOE WIN', 'ウィン', 'ミャンマー', '2003-12-21', '070-9018-4105', NULL, '大阪府大阪市淀川区三津屋南1-13-6 レオパレスアクトⅡ 304号室', NULL, NULL, NULL, '2025-10-05 01:50:26.731+00', '2025-10-05 01:50:26.670825+00', NULL, '在籍中', NULL, 'UH55862780EA', '2026-09-08', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2157'),
	('3397', 'THARU PRATIK SING', 'タル', 'ネパール', '1993-01-11', '08048205811', NULL, '大阪府堺市堺区東雲西町2丁2番34号 サンワード301', NULL, NULL, NULL, '2025-10-05 01:50:26.763+00', '2025-10-05 01:50:26.702849+00', NULL, '入社待ち', NULL, 'UH25621492EA', '2026-01-22', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2585'),
	('3411', 'ADHIKARI ALISHA', 'アリサ', 'ネパール', '2002-05-11', '070-9042-8420', NULL, '埼玉県桶川市北1丁目23番4号 ティエル/201号', NULL, NULL, NULL, '2025-10-05 01:50:26.777+00', '2025-10-05 01:50:26.721511+00', NULL, '入社待ち', NULL, 'SA93462580EA', '2025-11-10', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2620'),
	('3461', 'NEUPANE YAGYARAJ ', 'ネウパネ', 'ネパール', '2001-03-15', '080-7248-8053', NULL, '山口県下関市豊浦町川棚6237番地メゾンドF104号', NULL, NULL, NULL, '2025-10-05 01:50:26.835+00', '2025-10-05 01:50:26.773997+00', NULL, '入社待ち', NULL, 'UH20833268EA', '2026-08-05', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2637'),
	('3514', 'SINGH SAROJ KUMAR ', 'シンガ　', 'ネパール', '1993-03-14', '07090771895', NULL, '大阪府大阪市都島区都島北通２−23−26 サンピアレス都島201号', NULL, NULL, NULL, '2025-10-05 01:50:26.85+00', '2025-10-05 01:50:26.789522+00', NULL, '入社待ち', NULL, 'UH46031294LA', '2026-07-30', NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2662'),
	('3529', 'BHATTA RAJU', 'ラズ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.868+00', '2025-10-05 01:50:26.807525+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2686'),
	('3541', 'RAI PRADIP', 'プラディープ', 'ネパール', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-05 01:50:26.912+00', '2025-10-05 01:50:26.850711+00', NULL, '入社待ち', NULL, NULL, NULL, NULL, '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', '2698');


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
	('e63bd008-6e0c-4ffe-adbc-2386ffedee7f', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'manual', 'success', '2025-10-05 00:58:14.423159+00', '2025-10-05 00:58:16.106+00', 123, 123, 0, NULL, NULL, '2025-10-05 00:58:14.423159+00', '2025-10-05 00:58:15.617806+00'),
	('73b834a9-2292-4560-b51f-877b1edd2e2b', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'manual', 'success', '2025-10-05 01:06:56.079152+00', '2025-10-05 01:06:56.353+00', 0, 0, 0, NULL, NULL, '2025-10-05 01:06:56.079152+00', '2025-10-05 01:06:56.336762+00'),
	('0be4daf0-1760-4331-99f3-108122fc2bdd', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'manual', 'success', '2025-10-05 01:26:28.47285+00', '2025-10-05 01:26:28.793+00', 1, 1, 0, NULL, NULL, '2025-10-05 01:26:28.47285+00', '2025-10-05 01:26:28.786207+00'),
	('71fbe3ec-0ab9-4b20-aec7-042e62669b0c', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'manual', 'success', '2025-10-05 01:26:56.328101+00', '2025-10-05 01:26:57.652+00', 123, 123, 0, NULL, NULL, '2025-10-05 01:26:56.328101+00', '2025-10-05 01:26:57.644766+00'),
	('ac6e959f-e5de-444e-b115-7dc293eac66d', '1c5a22c7-ca7c-4db7-9509-d91aff15aee0', 'e68b03c9-d87c-4ae3-845e-fa1be690ca92', 'manual', 'success', '2025-10-05 01:50:25.921228+00', '2025-10-05 01:50:26.931+00', 123, 123, 0, NULL, NULL, '2025-10-05 01:50:25.921228+00', '2025-10-05 01:50:26.869326+00');


--
-- Data for Name: sync_item_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sync_item_logs" ("id", "session_id", "item_type", "item_id", "status", "timestamp", "error_details", "created_at") VALUES
	('fba715f6-5410-4efb-b2b3-6adad5b00f8c', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '504', 'success', '2025-10-05 00:58:14.666986+00', NULL, '2025-10-05 00:58:14.666986+00'),
	('35905823-09a5-40f4-8be0-6f0d4a9fcd6f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '505', 'success', '2025-10-05 00:58:14.675946+00', NULL, '2025-10-05 00:58:14.675946+00'),
	('7680011d-9bc0-4cba-a8aa-f74ca93f56fb', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '506', 'success', '2025-10-05 00:58:14.685178+00', NULL, '2025-10-05 00:58:14.685178+00'),
	('86793fe5-7468-44e8-824c-59654f438022', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '507', 'success', '2025-10-05 00:58:14.694307+00', NULL, '2025-10-05 00:58:14.694307+00'),
	('5283b5e9-f8dd-4320-bfd3-8127eb79a0b5', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '508', 'success', '2025-10-05 00:58:14.703459+00', NULL, '2025-10-05 00:58:14.703459+00'),
	('7f88ddb3-4033-47ab-b6c6-b30fff410552', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '509', 'success', '2025-10-05 00:58:14.715377+00', NULL, '2025-10-05 00:58:14.715377+00'),
	('0d18cb71-0b63-4641-88c5-c845f2a063ef', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '510', 'success', '2025-10-05 00:58:14.722574+00', NULL, '2025-10-05 00:58:14.722574+00'),
	('23d4a16d-e03e-4747-9f09-2bc21f9c6c6e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '511', 'success', '2025-10-05 00:58:14.729712+00', NULL, '2025-10-05 00:58:14.729712+00'),
	('04923a24-7659-488c-b439-ca0cf8c923e7', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '512', 'success', '2025-10-05 00:58:14.736961+00', NULL, '2025-10-05 00:58:14.736961+00'),
	('26f9007d-9baf-4f17-bd21-1a53dbb0e5f2', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '513', 'success', '2025-10-05 00:58:14.743647+00', NULL, '2025-10-05 00:58:14.743647+00'),
	('9a923e95-40d8-4c57-b3ce-16032246065c', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '514', 'success', '2025-10-05 00:58:14.750028+00', NULL, '2025-10-05 00:58:14.750028+00'),
	('02fbb21f-0c74-49c9-b05f-0c1328ffb925', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '515', 'success', '2025-10-05 00:58:14.758694+00', NULL, '2025-10-05 00:58:14.758694+00'),
	('7b6cb1a6-4c86-4f5d-a145-c5649e454c16', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '516', 'success', '2025-10-05 00:58:14.767029+00', NULL, '2025-10-05 00:58:14.767029+00'),
	('0f18d84f-b2e3-4731-85d4-fd1c844e110c', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '517', 'success', '2025-10-05 00:58:14.774564+00', NULL, '2025-10-05 00:58:14.774564+00'),
	('3a574430-e01f-49e3-8228-382644aeb4b1', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '518', 'success', '2025-10-05 00:58:14.789672+00', NULL, '2025-10-05 00:58:14.789672+00'),
	('c7d8c5c5-d3ce-4847-a7f7-2959a1773db5', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '519', 'success', '2025-10-05 00:58:14.795833+00', NULL, '2025-10-05 00:58:14.795833+00'),
	('ca2b6de5-c38f-4fb9-9713-87fa9f148c97', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '520', 'success', '2025-10-05 00:58:14.802778+00', NULL, '2025-10-05 00:58:14.802778+00'),
	('74cdf2d1-cdf2-4b39-9790-c5b5f15c1512', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '521', 'success', '2025-10-05 00:58:14.809669+00', NULL, '2025-10-05 00:58:14.809669+00'),
	('ddcf3f58-f2bc-485f-8035-e97f641ea43a', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '522', 'success', '2025-10-05 00:58:14.816355+00', NULL, '2025-10-05 00:58:14.816355+00'),
	('6d6c516d-b07c-49fc-8183-38dbcf5756e8', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '523', 'success', '2025-10-05 00:58:14.822642+00', NULL, '2025-10-05 00:58:14.822642+00'),
	('79b82f1c-f2de-492d-b033-972231daab2f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '524', 'success', '2025-10-05 00:58:14.829125+00', NULL, '2025-10-05 00:58:14.829125+00'),
	('529f49f2-4799-4e76-9e01-66b90dd5570f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '525', 'success', '2025-10-05 00:58:14.835286+00', NULL, '2025-10-05 00:58:14.835286+00'),
	('059459cd-da11-4cb1-9ef0-b1ac31e03d72', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '526', 'success', '2025-10-05 00:58:14.84176+00', NULL, '2025-10-05 00:58:14.84176+00'),
	('379eefdb-5258-4550-a7ad-16a205b942a0', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '527', 'success', '2025-10-05 00:58:14.848528+00', NULL, '2025-10-05 00:58:14.848528+00'),
	('f5ff7e9c-5d05-4a1b-9ec9-8aa112be0375', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1043', 'success', '2025-10-05 00:58:14.855443+00', NULL, '2025-10-05 00:58:14.855443+00'),
	('4ee8cd63-25e4-497e-9287-616bc6597c01', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1045', 'success', '2025-10-05 00:58:14.864892+00', NULL, '2025-10-05 00:58:14.864892+00'),
	('cbb96688-2a39-41f9-bc91-b88cc37345d3', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1046', 'success', '2025-10-05 00:58:14.872013+00', NULL, '2025-10-05 00:58:14.872013+00'),
	('251a63c2-e2f2-4875-a3ba-6212b3ac81a5', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1048', 'success', '2025-10-05 00:58:14.879824+00', NULL, '2025-10-05 00:58:14.879824+00'),
	('52b2195b-c169-4d38-86fd-c0722b99a6fa', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1049', 'success', '2025-10-05 00:58:14.886459+00', NULL, '2025-10-05 00:58:14.886459+00'),
	('36d8e786-9c66-4c9b-8bf7-39bd15570e33', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1051', 'success', '2025-10-05 00:58:14.894261+00', NULL, '2025-10-05 00:58:14.894261+00'),
	('bf119c4d-4059-41f8-8354-d529cdbcdfbf', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1052', 'success', '2025-10-05 00:58:14.902319+00', NULL, '2025-10-05 00:58:14.902319+00'),
	('83f40ac7-bd11-4810-833e-1e6480f84632', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1054', 'success', '2025-10-05 00:58:14.910256+00', NULL, '2025-10-05 00:58:14.910256+00'),
	('c3e8648c-1e15-4a8e-8d2f-07f034bfd79a', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1055', 'success', '2025-10-05 00:58:14.918384+00', NULL, '2025-10-05 00:58:14.918384+00'),
	('56235e5e-83e4-4f1d-a3da-6746ebd80a44', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1056', 'success', '2025-10-05 00:58:14.925531+00', NULL, '2025-10-05 00:58:14.925531+00'),
	('869a8fe4-4776-4f54-b09b-120451fe2193', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1058', 'success', '2025-10-05 00:58:14.933718+00', NULL, '2025-10-05 00:58:14.933718+00'),
	('6a0ec08e-ce36-4704-94f8-bf1a38807196', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1061', 'success', '2025-10-05 00:58:14.941074+00', NULL, '2025-10-05 00:58:14.941074+00'),
	('7c20f9da-14c3-4378-af2c-293357be04b8', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1064', 'success', '2025-10-05 00:58:14.947584+00', NULL, '2025-10-05 00:58:14.947584+00'),
	('a03ccc35-b348-4d48-88ce-6b698cca124d', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1067', 'success', '2025-10-05 00:58:14.967627+00', NULL, '2025-10-05 00:58:14.967627+00'),
	('a0ef263b-0ae2-4f59-a79b-18cb9019e5e9', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1069', 'success', '2025-10-05 00:58:14.975744+00', NULL, '2025-10-05 00:58:14.975744+00'),
	('13022506-1f94-4cbc-91d9-10ca6b8c3c02', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1071', 'success', '2025-10-05 00:58:14.982454+00', NULL, '2025-10-05 00:58:14.982454+00'),
	('64ad2d6d-6d24-44e0-9c55-620dd0c76054', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1073', 'success', '2025-10-05 00:58:14.988969+00', NULL, '2025-10-05 00:58:14.988969+00'),
	('5d8c0fa7-9acf-400c-b667-fe988fb88433', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1074', 'success', '2025-10-05 00:58:14.996529+00', NULL, '2025-10-05 00:58:14.996529+00'),
	('645003f7-616a-450e-9542-89dcfcaeef20', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1076', 'success', '2025-10-05 00:58:15.004258+00', NULL, '2025-10-05 00:58:15.004258+00'),
	('cdae896d-072f-4343-b023-14f53c17a96c', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1094', 'success', '2025-10-05 00:58:15.011645+00', NULL, '2025-10-05 00:58:15.011645+00'),
	('ef6fda2d-c4c4-46aa-a24d-64e2aabf949d', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1096', 'success', '2025-10-05 00:58:15.018391+00', NULL, '2025-10-05 00:58:15.018391+00'),
	('249cda94-16e8-44f9-a886-10bda82da32d', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '1129', 'success', '2025-10-05 00:58:15.024788+00', NULL, '2025-10-05 00:58:15.024788+00'),
	('ff83768d-a657-4852-a516-cf7bf2e019e1', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2682', 'success', '2025-10-05 00:58:15.031728+00', NULL, '2025-10-05 00:58:15.031728+00'),
	('9594cfef-41c3-4a94-9ba2-32a8ab2ae916', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2683', 'success', '2025-10-05 00:58:15.038388+00', NULL, '2025-10-05 00:58:15.038388+00'),
	('1df6cd65-dd87-4884-806b-7f62a8fa0ae1', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2684', 'success', '2025-10-05 00:58:15.044686+00', NULL, '2025-10-05 00:58:15.044686+00'),
	('e6efbccd-5932-4777-a476-e150e730b1d2', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2685', 'success', '2025-10-05 00:58:15.051019+00', NULL, '2025-10-05 00:58:15.051019+00'),
	('92e03875-126b-4d32-b505-f60f233c621f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2832', 'success', '2025-10-05 00:58:15.057624+00', NULL, '2025-10-05 00:58:15.057624+00'),
	('d21b7865-53b7-401f-994f-84150d8ec0db', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2871', 'success', '2025-10-05 00:58:15.064397+00', NULL, '2025-10-05 00:58:15.064397+00'),
	('406458d2-b931-405c-a2e4-6366f1bcb804', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2872', 'success', '2025-10-05 00:58:15.071794+00', NULL, '2025-10-05 00:58:15.071794+00'),
	('f8f20981-12f5-49c3-b6a7-9f8cf39e0d98', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2873', 'success', '2025-10-05 00:58:15.078346+00', NULL, '2025-10-05 00:58:15.078346+00'),
	('64cda470-6626-4f21-8054-9fa9f7bee94e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2874', 'success', '2025-10-05 00:58:15.085094+00', NULL, '2025-10-05 00:58:15.085094+00'),
	('ed40be81-0cf5-4ed2-8108-9ff30b9c349f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2875', 'success', '2025-10-05 00:58:15.09233+00', NULL, '2025-10-05 00:58:15.09233+00'),
	('34cdb37d-2932-473a-8899-a55ebed335fa', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2876', 'success', '2025-10-05 00:58:15.098972+00', NULL, '2025-10-05 00:58:15.098972+00'),
	('480175de-dcb0-4abc-b3ec-2bc5620b4ae2', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2877', 'success', '2025-10-05 00:58:15.105557+00', NULL, '2025-10-05 00:58:15.105557+00'),
	('61274f43-d05e-446c-9bdd-8fe444ca1a00', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2878', 'success', '2025-10-05 00:58:15.111716+00', NULL, '2025-10-05 00:58:15.111716+00'),
	('a3ce1bd0-7487-4ec8-9824-6e763aad77a3', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2879', 'success', '2025-10-05 00:58:15.118075+00', NULL, '2025-10-05 00:58:15.118075+00'),
	('1f9a3ab4-2c23-4810-92c3-f501dd1e550e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2880', 'success', '2025-10-05 00:58:15.124883+00', NULL, '2025-10-05 00:58:15.124883+00'),
	('6ca593bb-57dc-41e6-846c-2abd744b6f40', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2881', 'success', '2025-10-05 00:58:15.13271+00', NULL, '2025-10-05 00:58:15.13271+00'),
	('6543a065-c8f6-4eea-895b-5ea598e8f26f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2882', 'success', '2025-10-05 00:58:15.140083+00', NULL, '2025-10-05 00:58:15.140083+00'),
	('b8c0fce8-5ec2-463c-bfaf-080c55789d85', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2883', 'success', '2025-10-05 00:58:15.14733+00', NULL, '2025-10-05 00:58:15.14733+00'),
	('2737af10-eb42-443f-9e62-188d2eb2eeed', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2884', 'success', '2025-10-05 00:58:15.15404+00', NULL, '2025-10-05 00:58:15.15404+00'),
	('74c543f0-2942-4e6a-b817-81616e33f8eb', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2885', 'success', '2025-10-05 00:58:15.162091+00', NULL, '2025-10-05 00:58:15.162091+00'),
	('a46b64e0-1bbe-4995-a09a-6b8a3afc60d3', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2886', 'success', '2025-10-05 00:58:15.168363+00', NULL, '2025-10-05 00:58:15.168363+00'),
	('4ffd4e01-29a0-4cd4-b623-c658bf7aaa92', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2887', 'success', '2025-10-05 00:58:15.174931+00', NULL, '2025-10-05 00:58:15.174931+00'),
	('c8408131-af52-4142-8391-5cee9fca7899', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2888', 'success', '2025-10-05 00:58:15.181579+00', NULL, '2025-10-05 00:58:15.181579+00'),
	('765ee939-d8c3-477e-ad4f-3ce1fbb5d796', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2891', 'success', '2025-10-05 00:58:15.188135+00', NULL, '2025-10-05 00:58:15.188135+00'),
	('c4fe2f95-285d-47c1-9043-6854bd02b12e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2892', 'success', '2025-10-05 00:58:15.194171+00', NULL, '2025-10-05 00:58:15.194171+00'),
	('79a21595-4495-41a5-87dd-e7d0b7fb14dd', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2893', 'success', '2025-10-05 00:58:15.200098+00', NULL, '2025-10-05 00:58:15.200098+00'),
	('1fcb2ae8-9e3c-46ae-806d-8fc2f39bfb27', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2894', 'success', '2025-10-05 00:58:15.206921+00', NULL, '2025-10-05 00:58:15.206921+00'),
	('2af743a2-c70d-44ce-a04d-75449eced95c', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2895', 'success', '2025-10-05 00:58:15.213091+00', NULL, '2025-10-05 00:58:15.213091+00'),
	('2fc3a66a-1082-4ddf-968c-791605d06b78', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2896', 'success', '2025-10-05 00:58:15.220685+00', NULL, '2025-10-05 00:58:15.220685+00'),
	('885a0e18-7f62-41c9-a7e7-721f41be6e34', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2898', 'success', '2025-10-05 00:58:15.227035+00', NULL, '2025-10-05 00:58:15.227035+00'),
	('21b050e9-3d44-42eb-943a-45ebf659014e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2902', 'success', '2025-10-05 00:58:15.233205+00', NULL, '2025-10-05 00:58:15.233205+00'),
	('0a8eb990-8165-427b-aa02-2e66dcb98567', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2911', 'success', '2025-10-05 00:58:15.239825+00', NULL, '2025-10-05 00:58:15.239825+00'),
	('f9b1cb69-dfca-443b-8fc9-1a8a4ecb7b71', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2912', 'success', '2025-10-05 00:58:15.246314+00', NULL, '2025-10-05 00:58:15.246314+00'),
	('75bbfa02-e95f-48cd-a1de-1a173b4b79cd', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '2963', 'success', '2025-10-05 00:58:15.253208+00', NULL, '2025-10-05 00:58:15.253208+00'),
	('522da41c-10cf-4c7d-a8cc-3a84b7a2c221', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3046', 'success', '2025-10-05 00:58:15.26028+00', NULL, '2025-10-05 00:58:15.26028+00'),
	('e246ee4b-a519-4e13-a2b6-d02d1fc8838a', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3047', 'success', '2025-10-05 00:58:15.266065+00', NULL, '2025-10-05 00:58:15.266065+00'),
	('3fe24a2a-9eb7-45c0-9edb-7ea6022be70e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3140', 'success', '2025-10-05 00:58:15.279819+00', NULL, '2025-10-05 00:58:15.279819+00'),
	('06da8303-d39b-4039-843e-0846473bb840', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3153', 'success', '2025-10-05 00:58:15.297312+00', NULL, '2025-10-05 00:58:15.297312+00'),
	('71ed4a66-081a-4dee-8e9c-2f33af8be367', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3155', 'success', '2025-10-05 00:58:15.312149+00', NULL, '2025-10-05 00:58:15.312149+00'),
	('0c1f9809-df25-4885-be73-b11ab29cf814', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3235', 'success', '2025-10-05 00:58:15.329749+00', NULL, '2025-10-05 00:58:15.329749+00'),
	('dedff830-6bc0-44e6-a783-8117fd08c88c', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3246', 'success', '2025-10-05 00:58:15.348566+00', NULL, '2025-10-05 00:58:15.348566+00'),
	('b67f08ae-bb42-46f4-8813-85b8902eb843', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3248', 'success', '2025-10-05 00:58:15.366451+00', NULL, '2025-10-05 00:58:15.366451+00'),
	('e3d35c60-6202-402d-8737-c805fb276153', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3397', 'success', '2025-10-05 00:58:15.383528+00', NULL, '2025-10-05 00:58:15.383528+00'),
	('289dbaf7-4e67-489c-954d-9b17eeb938db', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3411', 'success', '2025-10-05 00:58:15.401504+00', NULL, '2025-10-05 00:58:15.401504+00'),
	('33338a90-4482-48d3-9131-2f3bb5723b57', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3413', 'success', '2025-10-05 00:58:15.418818+00', NULL, '2025-10-05 00:58:15.418818+00'),
	('dcb8578f-b8a4-4cca-9c82-e2a455476210', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3461', 'success', '2025-10-05 00:58:15.438515+00', NULL, '2025-10-05 00:58:15.438515+00'),
	('ae0b3fcb-ac75-43d8-90ed-86e3d29780ad', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3509', 'success', '2025-10-05 00:58:15.454524+00', NULL, '2025-10-05 00:58:15.454524+00'),
	('79b2d6d3-57b4-4ae6-b29d-a33309f2e7d5', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3514', 'success', '2025-10-05 00:58:15.46992+00', NULL, '2025-10-05 00:58:15.46992+00'),
	('8f385122-359a-456e-9ea6-2230e2520f41', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3526', 'success', '2025-10-05 00:58:15.486884+00', NULL, '2025-10-05 00:58:15.486884+00'),
	('ba306f03-db3d-4492-afd5-e6e71c2df831', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3529', 'success', '2025-10-05 00:58:15.504317+00', NULL, '2025-10-05 00:58:15.504317+00'),
	('961c75d2-8444-4982-a2c0-5c9dec35307e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3533', 'success', '2025-10-05 00:58:15.521157+00', NULL, '2025-10-05 00:58:15.521157+00'),
	('958601ac-8574-4152-9f58-ab1fbd44b0ac', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3535', 'success', '2025-10-05 00:58:15.535944+00', NULL, '2025-10-05 00:58:15.535944+00'),
	('c8cd235a-7f0b-4b86-9cad-7a2bbd866874', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3537', 'success', '2025-10-05 00:58:15.552302+00', NULL, '2025-10-05 00:58:15.552302+00'),
	('56396500-d0d2-4a9d-bdfe-2d2073c5409d', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3539', 'success', '2025-10-05 00:58:15.567824+00', NULL, '2025-10-05 00:58:15.567824+00'),
	('b639b6a6-b9b5-4b3a-92d4-37721ffa44d3', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3541', 'success', '2025-10-05 00:58:15.584812+00', NULL, '2025-10-05 00:58:15.584812+00'),
	('02280325-5b66-4623-8dd1-da013bceb768', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3543', 'success', '2025-10-05 00:58:15.604523+00', NULL, '2025-10-05 00:58:15.604523+00'),
	('3c85e99d-c520-403c-b98a-4b9549b57c6b', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3051', 'success', '2025-10-05 00:58:15.272418+00', NULL, '2025-10-05 00:58:15.272418+00'),
	('ba0adc07-b47e-427d-abf1-ccd6a3172006', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3152', 'success', '2025-10-05 00:58:15.289155+00', NULL, '2025-10-05 00:58:15.289155+00'),
	('263a8442-33ca-4f59-920c-bb18b0039043', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3154', 'success', '2025-10-05 00:58:15.305414+00', NULL, '2025-10-05 00:58:15.305414+00'),
	('d5a31c78-df47-4233-bf45-d65dfb7e70b1', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3234', 'success', '2025-10-05 00:58:15.321951+00', NULL, '2025-10-05 00:58:15.321951+00'),
	('5e5e7ac0-4a27-46c3-9bff-6c36e4faaae3', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3245', 'success', '2025-10-05 00:58:15.338802+00', NULL, '2025-10-05 00:58:15.338802+00'),
	('2acddd26-ab8d-4cdf-a779-576e0c418b64', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3247', 'success', '2025-10-05 00:58:15.359508+00', NULL, '2025-10-05 00:58:15.359508+00'),
	('7aea871f-8d98-4653-87ea-3221d671a7cb', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3249', 'success', '2025-10-05 00:58:15.374932+00', NULL, '2025-10-05 00:58:15.374932+00'),
	('b1c1b488-33f8-415c-a0f5-63ba0920ab96', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3410', 'success', '2025-10-05 00:58:15.39237+00', NULL, '2025-10-05 00:58:15.39237+00'),
	('15321a58-82f1-481b-a4ba-47a7cf69b5db', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3412', 'success', '2025-10-05 00:58:15.410896+00', NULL, '2025-10-05 00:58:15.410896+00'),
	('8ed12fe1-af7f-4a7c-9f0f-275bfe325315', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3414', 'success', '2025-10-05 00:58:15.427091+00', NULL, '2025-10-05 00:58:15.427091+00'),
	('7ce007f4-6789-4db7-b949-cc56b093f86e', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3508', 'success', '2025-10-05 00:58:15.445192+00', NULL, '2025-10-05 00:58:15.445192+00'),
	('0115d8c3-28d6-4ba0-9143-cbcff7b169e6', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3510', 'success', '2025-10-05 00:58:15.461522+00', NULL, '2025-10-05 00:58:15.461522+00'),
	('12b7b133-0849-4406-9669-d5a55f03bbf2', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3515', 'success', '2025-10-05 00:58:15.47679+00', NULL, '2025-10-05 00:58:15.47679+00'),
	('c04ca147-f54b-4014-ba26-aeb954f1cbac', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3527', 'success', '2025-10-05 00:58:15.495279+00', NULL, '2025-10-05 00:58:15.495279+00'),
	('4db53fac-6534-49b7-8178-df188b1aaa55', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3530', 'success', '2025-10-05 00:58:15.511681+00', NULL, '2025-10-05 00:58:15.511681+00'),
	('ae8c3beb-6766-4bc2-868d-f0cad048c83f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3534', 'success', '2025-10-05 00:58:15.527783+00', NULL, '2025-10-05 00:58:15.527783+00'),
	('37ce4fdb-2cdd-45e1-a43b-9f0ea53d585a', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3536', 'success', '2025-10-05 00:58:15.542421+00', NULL, '2025-10-05 00:58:15.542421+00'),
	('40384065-989a-46a2-a1fe-8d0ea204f96f', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3538', 'success', '2025-10-05 00:58:15.560424+00', NULL, '2025-10-05 00:58:15.560424+00'),
	('810f1cd3-9ae9-4b83-84b2-8c02bef1fdeb', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3540', 'success', '2025-10-05 00:58:15.57747+00', NULL, '2025-10-05 00:58:15.57747+00'),
	('f34a3b5d-2ce9-45b6-9c41-2c57c1d39a12', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3542', 'success', '2025-10-05 00:58:15.594213+00', NULL, '2025-10-05 00:58:15.594213+00'),
	('aaa12bd1-67bf-4e58-928f-04853d89ab1c', 'e63bd008-6e0c-4ffe-adbc-2386ffedee7f', 'people', '3544', 'success', '2025-10-05 00:58:15.614332+00', NULL, '2025-10-05 00:58:15.614332+00'),
	('2041f94c-71ea-4b77-ae10-d9d8c238982c', '73b834a9-2292-4560-b51f-877b1edd2e2b', 'people', '884', 'failed', '2025-10-05 01:06:56.332244+00', 'Unknown error', '2025-10-05 01:06:56.332244+00'),
	('c8660da4-9a58-4f5a-939a-e1042d953aca', '0be4daf0-1760-4331-99f3-108122fc2bdd', 'people', '884', 'success', '2025-10-05 01:26:28.781894+00', NULL, '2025-10-05 01:26:28.781894+00'),
	('c8331d0a-cb0d-44a1-894e-ae9617cd5087', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '504', 'success', '2025-10-05 01:26:56.647592+00', NULL, '2025-10-05 01:26:56.647592+00'),
	('58661ce2-5348-4b7c-8b7d-3fdc7fd234d6', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '505', 'success', '2025-10-05 01:26:56.663119+00', NULL, '2025-10-05 01:26:56.663119+00'),
	('c7322c95-2683-41f4-90a6-8034455b4f70', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '506', 'success', '2025-10-05 01:26:56.675073+00', NULL, '2025-10-05 01:26:56.675073+00'),
	('9de6adba-6831-4e68-b2fc-5de7429da4be', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '507', 'success', '2025-10-05 01:26:56.687305+00', NULL, '2025-10-05 01:26:56.687305+00'),
	('fc1afd02-160c-4f2b-b849-adfb1476e5e2', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '508', 'success', '2025-10-05 01:26:56.698061+00', NULL, '2025-10-05 01:26:56.698061+00'),
	('1e592f1e-77c7-4bbc-8daf-1186dfbe91bb', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '509', 'success', '2025-10-05 01:26:56.718556+00', NULL, '2025-10-05 01:26:56.718556+00'),
	('4285583d-c4e6-48ff-8fc2-174d92e177f3', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '510', 'success', '2025-10-05 01:26:56.738792+00', NULL, '2025-10-05 01:26:56.738792+00'),
	('cc944ff2-8459-4f3b-9ecc-7303e083bd30', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '511', 'success', '2025-10-05 01:26:56.754215+00', NULL, '2025-10-05 01:26:56.754215+00'),
	('62ec262f-9d4e-481a-96cd-7e64e7bcdf5d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '512', 'success', '2025-10-05 01:26:56.777744+00', NULL, '2025-10-05 01:26:56.777744+00'),
	('bb03c2b1-ee3c-49d5-910f-b4e124da93be', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '513', 'success', '2025-10-05 01:26:56.788094+00', NULL, '2025-10-05 01:26:56.788094+00'),
	('f08ee828-5ff4-4529-a94f-b420e721577d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '514', 'success', '2025-10-05 01:26:56.796818+00', NULL, '2025-10-05 01:26:56.796818+00'),
	('6ebfc521-b645-4b93-b87e-0c31fa15b73d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '515', 'success', '2025-10-05 01:26:56.804616+00', NULL, '2025-10-05 01:26:56.804616+00'),
	('98ed29d2-3c4f-4aa2-af3d-26b4753f3113', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '516', 'success', '2025-10-05 01:26:56.812289+00', NULL, '2025-10-05 01:26:56.812289+00'),
	('8cb6282a-1990-4043-a88a-156f662dc970', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '517', 'success', '2025-10-05 01:26:56.820682+00', NULL, '2025-10-05 01:26:56.820682+00'),
	('15332d9e-cf1d-43ba-9b23-44087a292a60', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '518', 'success', '2025-10-05 01:26:56.827211+00', NULL, '2025-10-05 01:26:56.827211+00'),
	('154ab349-bd46-47f3-943e-779a5ea3b0fe', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '519', 'success', '2025-10-05 01:26:56.835297+00', NULL, '2025-10-05 01:26:56.835297+00'),
	('1e598812-d784-48f7-9e9e-bc970f13914d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '520', 'success', '2025-10-05 01:26:56.844153+00', NULL, '2025-10-05 01:26:56.844153+00'),
	('11aaa425-0c0d-4e59-b145-42832f66239e', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '521', 'success', '2025-10-05 01:26:56.853192+00', NULL, '2025-10-05 01:26:56.853192+00'),
	('ee4f300b-5b65-4417-b1c3-bba259101074', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '522', 'success', '2025-10-05 01:26:56.859882+00', NULL, '2025-10-05 01:26:56.859882+00'),
	('acfd2240-43a3-4e40-912d-b564081909b7', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '523', 'success', '2025-10-05 01:26:56.868317+00', NULL, '2025-10-05 01:26:56.868317+00'),
	('acaf0de9-88e2-423d-b45b-c3e3c53a07b8', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '524', 'success', '2025-10-05 01:26:56.875306+00', NULL, '2025-10-05 01:26:56.875306+00'),
	('53020d7f-4e81-47ae-a527-ff5793a66ab2', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '525', 'success', '2025-10-05 01:26:56.883277+00', NULL, '2025-10-05 01:26:56.883277+00'),
	('73ef5410-a799-4bf3-8ce7-dc90ba76e8b6', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '526', 'success', '2025-10-05 01:26:56.889855+00', NULL, '2025-10-05 01:26:56.889855+00'),
	('8ab9d451-e958-46f4-b201-928737651b68', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '527', 'success', '2025-10-05 01:26:56.896752+00', NULL, '2025-10-05 01:26:56.896752+00'),
	('2e777bb6-78dd-470c-8069-c26a7f2621fd', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1043', 'success', '2025-10-05 01:26:56.906025+00', NULL, '2025-10-05 01:26:56.906025+00'),
	('8fe7afb3-90e5-4a5a-ada0-968b2f16cfba', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1045', 'success', '2025-10-05 01:26:56.914073+00', NULL, '2025-10-05 01:26:56.914073+00'),
	('0f5d6d23-3288-43f5-9ec6-f691d87b04a3', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1046', 'success', '2025-10-05 01:26:56.921699+00', NULL, '2025-10-05 01:26:56.921699+00'),
	('9429cda2-5e93-43f2-838b-b89e9fc12b7d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1048', 'success', '2025-10-05 01:26:56.928005+00', NULL, '2025-10-05 01:26:56.928005+00'),
	('624638b7-3713-46e5-ba34-3f26f5b856e7', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1049', 'success', '2025-10-05 01:26:56.93495+00', NULL, '2025-10-05 01:26:56.93495+00'),
	('5cf221f0-7fc4-4549-ad41-29ddcd1edd4f', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1051', 'success', '2025-10-05 01:26:56.94677+00', NULL, '2025-10-05 01:26:56.94677+00'),
	('154fa89f-0b5f-4a9d-9744-8453fbdfadf2', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1052', 'success', '2025-10-05 01:26:56.955043+00', NULL, '2025-10-05 01:26:56.955043+00'),
	('f307e36f-3e83-481b-9682-0c1c5af60154', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1054', 'success', '2025-10-05 01:26:56.961642+00', NULL, '2025-10-05 01:26:56.961642+00'),
	('3d5a36e7-e8ea-474c-87c2-8506c2752efc', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1055', 'success', '2025-10-05 01:26:56.969199+00', NULL, '2025-10-05 01:26:56.969199+00'),
	('49b18b12-ea46-4097-9a85-71549465ee03', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1056', 'success', '2025-10-05 01:26:56.975779+00', NULL, '2025-10-05 01:26:56.975779+00'),
	('09b1cfe4-a07d-4808-b122-08514ded868c', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1058', 'success', '2025-10-05 01:26:56.984478+00', NULL, '2025-10-05 01:26:56.984478+00'),
	('9428f12b-99fb-4306-8812-25d769390f7c', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1061', 'success', '2025-10-05 01:26:56.991501+00', NULL, '2025-10-05 01:26:56.991501+00'),
	('1b06d738-3263-411d-9ead-1cd0ca9e7b02', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1064', 'success', '2025-10-05 01:26:56.999305+00', NULL, '2025-10-05 01:26:56.999305+00'),
	('98e9b698-cd49-4ec1-9058-2a71f314af4e', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1067', 'success', '2025-10-05 01:26:57.006445+00', NULL, '2025-10-05 01:26:57.006445+00'),
	('a9113b03-a1fe-4edd-bfd6-345cc1aef900', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1069', 'success', '2025-10-05 01:26:57.014219+00', NULL, '2025-10-05 01:26:57.014219+00'),
	('259da2e6-727c-4ebe-b56c-491cc6ed2e5d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1071', 'success', '2025-10-05 01:26:57.02065+00', NULL, '2025-10-05 01:26:57.02065+00'),
	('90fff306-a506-4776-a8da-adeafef73826', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1073', 'success', '2025-10-05 01:26:57.042298+00', NULL, '2025-10-05 01:26:57.042298+00'),
	('9147d263-159c-4e8b-8287-e24951aa91d2', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1074', 'success', '2025-10-05 01:26:57.051151+00', NULL, '2025-10-05 01:26:57.051151+00'),
	('3d27c873-86c2-4d77-9043-261cb35aa341', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1076', 'success', '2025-10-05 01:26:57.057986+00', NULL, '2025-10-05 01:26:57.057986+00'),
	('8b4619e6-1a68-4a9a-9b7f-af67feccfb77', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1094', 'success', '2025-10-05 01:26:57.06555+00', NULL, '2025-10-05 01:26:57.06555+00'),
	('3500ba27-e46e-4e01-a205-70ca9c8be3ca', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1096', 'success', '2025-10-05 01:26:57.072633+00', NULL, '2025-10-05 01:26:57.072633+00'),
	('66e717bf-fd78-41f1-805d-40f87eb1123b', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '1129', 'success', '2025-10-05 01:26:57.079623+00', NULL, '2025-10-05 01:26:57.079623+00'),
	('fd5dfe74-0611-4d93-bb86-5a090f76f698', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2682', 'success', '2025-10-05 01:26:57.086285+00', NULL, '2025-10-05 01:26:57.086285+00'),
	('9431ab1a-5523-4313-8e1c-d669e9700d16', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2683', 'success', '2025-10-05 01:26:57.09307+00', NULL, '2025-10-05 01:26:57.09307+00'),
	('6d0be41a-1365-48f9-9f64-5688ab74aeba', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2684', 'success', '2025-10-05 01:26:57.099064+00', NULL, '2025-10-05 01:26:57.099064+00'),
	('6fb91238-89b3-43c3-add6-65e06b2e8b01', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2685', 'success', '2025-10-05 01:26:57.106044+00', NULL, '2025-10-05 01:26:57.106044+00'),
	('3c71255c-c7c6-4202-9313-a0055b84d39f', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2832', 'success', '2025-10-05 01:26:57.113229+00', NULL, '2025-10-05 01:26:57.113229+00'),
	('f2a90b5f-a0a8-4b34-9832-c032236f03ae', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2871', 'success', '2025-10-05 01:26:57.119454+00', NULL, '2025-10-05 01:26:57.119454+00'),
	('6d93553e-08ca-4029-9211-b2f28d9b5f63', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2872', 'success', '2025-10-05 01:26:57.12711+00', NULL, '2025-10-05 01:26:57.12711+00'),
	('3e2d5034-5211-44d9-96fd-ad3456c62567', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2873', 'success', '2025-10-05 01:26:57.133533+00', NULL, '2025-10-05 01:26:57.133533+00'),
	('b4163e49-7dca-4094-a1c1-7e777904e763', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2874', 'success', '2025-10-05 01:26:57.141031+00', NULL, '2025-10-05 01:26:57.141031+00'),
	('9fe234ea-50cb-46ee-ae5d-93c3cce76008', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2875', 'success', '2025-10-05 01:26:57.148296+00', NULL, '2025-10-05 01:26:57.148296+00'),
	('ca0294bb-c455-46b5-8b3e-7a5151a52c4e', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2876', 'success', '2025-10-05 01:26:57.155374+00', NULL, '2025-10-05 01:26:57.155374+00'),
	('69875cbc-a3df-4379-b7fd-6145d792d778', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2877', 'success', '2025-10-05 01:26:57.162257+00', NULL, '2025-10-05 01:26:57.162257+00'),
	('2c6e65ec-c72e-4d10-9b33-0fc9e84fbc37', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2878', 'success', '2025-10-05 01:26:57.169798+00', NULL, '2025-10-05 01:26:57.169798+00'),
	('3f5f7b73-0ab8-4963-94d3-2ec5509d6aca', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2880', 'success', '2025-10-05 01:26:57.183293+00', NULL, '2025-10-05 01:26:57.183293+00'),
	('412f6661-15ca-4378-b832-94344e910974', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2882', 'success', '2025-10-05 01:26:57.20336+00', NULL, '2025-10-05 01:26:57.20336+00'),
	('26c3478e-a30b-404e-9609-d72ff60b6b40', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2884', 'success', '2025-10-05 01:26:57.218389+00', NULL, '2025-10-05 01:26:57.218389+00'),
	('da3d2a19-3098-425c-8b31-dcfd5a295e65', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2886', 'success', '2025-10-05 01:26:57.23608+00', NULL, '2025-10-05 01:26:57.23608+00'),
	('0d26ef9e-8a99-4c7d-a71a-6cc6e755b1bc', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2888', 'success', '2025-10-05 01:26:57.249961+00', NULL, '2025-10-05 01:26:57.249961+00'),
	('9a010608-7423-4a7f-b6f2-2218d576657d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2892', 'success', '2025-10-05 01:26:57.263891+00', NULL, '2025-10-05 01:26:57.263891+00'),
	('9e5aa164-4b51-4dd3-bd93-6350d5006938', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2894', 'success', '2025-10-05 01:26:57.277107+00', NULL, '2025-10-05 01:26:57.277107+00'),
	('bf1ba9cc-cae0-4cae-9fe5-e4642cf5b8b6', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2896', 'success', '2025-10-05 01:26:57.292461+00', NULL, '2025-10-05 01:26:57.292461+00'),
	('f5f28c7d-98b7-435c-bce3-fc895d2a8168', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2902', 'success', '2025-10-05 01:26:57.305864+00', NULL, '2025-10-05 01:26:57.305864+00'),
	('5b4cb4eb-6995-478c-a057-f86dae3c3e30', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2912', 'success', '2025-10-05 01:26:57.322638+00', NULL, '2025-10-05 01:26:57.322638+00'),
	('fde34ff4-cf80-4e9a-ac4a-0b7eba9f4004', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3046', 'success', '2025-10-05 01:26:57.340363+00', NULL, '2025-10-05 01:26:57.340363+00'),
	('bfd00ff3-b552-4cdb-9c42-139253e6967f', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3051', 'success', '2025-10-05 01:26:57.359624+00', NULL, '2025-10-05 01:26:57.359624+00'),
	('18ce8c2a-d58c-42c8-8b0d-4e9af7f074ef', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3152', 'success', '2025-10-05 01:26:57.374294+00', NULL, '2025-10-05 01:26:57.374294+00'),
	('01926c35-1ee2-4274-8174-ae5ad5270f11', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3154', 'success', '2025-10-05 01:26:57.390497+00', NULL, '2025-10-05 01:26:57.390497+00'),
	('be2bc775-0767-4a2b-b765-66a0a0e488bc', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3234', 'success', '2025-10-05 01:26:57.407181+00', NULL, '2025-10-05 01:26:57.407181+00'),
	('cd3d0fba-393e-411b-819e-f91cae157f15', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3245', 'success', '2025-10-05 01:26:57.422604+00', NULL, '2025-10-05 01:26:57.422604+00'),
	('0eb0c514-4ae5-43db-807c-06141987d852', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3247', 'success', '2025-10-05 01:26:57.435457+00', NULL, '2025-10-05 01:26:57.435457+00'),
	('481beb11-ca04-4a10-a439-df1425a784d1', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3249', 'success', '2025-10-05 01:26:57.449331+00', NULL, '2025-10-05 01:26:57.449331+00'),
	('dce395f1-9474-4440-9b43-d55d0c9d7875', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3410', 'success', '2025-10-05 01:26:57.462965+00', NULL, '2025-10-05 01:26:57.462965+00'),
	('573687a0-c98c-458e-880a-1dc07637cee6', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3412', 'success', '2025-10-05 01:26:57.476535+00', NULL, '2025-10-05 01:26:57.476535+00'),
	('69d09cf5-fee8-4f97-93ac-8b95ea70937c', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3414', 'success', '2025-10-05 01:26:57.489273+00', NULL, '2025-10-05 01:26:57.489273+00'),
	('b9dc564c-ac24-4184-934d-f414dbbedec5', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3508', 'success', '2025-10-05 01:26:57.501604+00', NULL, '2025-10-05 01:26:57.501604+00'),
	('d57ae94d-b202-4c35-8ca5-39b5385b368f', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3510', 'success', '2025-10-05 01:26:57.514756+00', NULL, '2025-10-05 01:26:57.514756+00'),
	('225bce7b-6182-4beb-af0d-1ca8f5553dc7', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3515', 'success', '2025-10-05 01:26:57.528479+00', NULL, '2025-10-05 01:26:57.528479+00'),
	('cc9a137a-d021-4660-9310-27dea650303b', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3527', 'success', '2025-10-05 01:26:57.542432+00', NULL, '2025-10-05 01:26:57.542432+00'),
	('024808d6-9638-49f9-ace7-ca4f8f178c4b', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3530', 'success', '2025-10-05 01:26:57.554898+00', NULL, '2025-10-05 01:26:57.554898+00'),
	('8fb25ccf-030e-4fff-8410-a42b5b56b8f1', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3534', 'success', '2025-10-05 01:26:57.571568+00', NULL, '2025-10-05 01:26:57.571568+00'),
	('b3cb039c-1bd1-405a-8c5d-2beefb4d906b', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3536', 'success', '2025-10-05 01:26:57.586259+00', NULL, '2025-10-05 01:26:57.586259+00'),
	('200453d4-5d81-4208-933f-9b46ad2f7e8a', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3538', 'success', '2025-10-05 01:26:57.601321+00', NULL, '2025-10-05 01:26:57.601321+00'),
	('338de711-1a49-49c0-bee6-1e926f942bc2', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3540', 'success', '2025-10-05 01:26:57.613817+00', NULL, '2025-10-05 01:26:57.613817+00'),
	('66780a89-615d-4107-8720-7d932a90ea56', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3542', 'success', '2025-10-05 01:26:57.628682+00', NULL, '2025-10-05 01:26:57.628682+00'),
	('e4a1cb5c-8a20-4f3f-8c0e-3df51969ce4c', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3544', 'success', '2025-10-05 01:26:57.642182+00', NULL, '2025-10-05 01:26:57.642182+00'),
	('d15ef988-d6f4-4202-8f04-550f146d2c26', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2879', 'success', '2025-10-05 01:26:57.176348+00', NULL, '2025-10-05 01:26:57.176348+00'),
	('79531477-4ee3-4b21-8d04-42063a11e3e5', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2881', 'success', '2025-10-05 01:26:57.196153+00', NULL, '2025-10-05 01:26:57.196153+00'),
	('68c82fb3-1805-49f6-846b-cb19a889b86c', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2883', 'success', '2025-10-05 01:26:57.211339+00', NULL, '2025-10-05 01:26:57.211339+00'),
	('ed039504-1dd5-4e83-815c-5626f2351d81', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2885', 'success', '2025-10-05 01:26:57.227927+00', NULL, '2025-10-05 01:26:57.227927+00'),
	('fb0ed38f-a3aa-4ebd-b5d8-d6209e38aa48', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2887', 'success', '2025-10-05 01:26:57.242975+00', NULL, '2025-10-05 01:26:57.242975+00'),
	('378a16cb-82a2-46fa-9919-e99e2f91e873', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2891', 'success', '2025-10-05 01:26:57.25671+00', NULL, '2025-10-05 01:26:57.25671+00'),
	('f52bc1dc-2b18-4240-88b6-932da99707e3', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2893', 'success', '2025-10-05 01:26:57.270515+00', NULL, '2025-10-05 01:26:57.270515+00'),
	('fe752a64-88f9-408a-bcc9-b7e7e2687ad8', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2895', 'success', '2025-10-05 01:26:57.284898+00', NULL, '2025-10-05 01:26:57.284898+00'),
	('9c050ea1-6010-4f67-adfa-819fe3231fb4', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2898', 'success', '2025-10-05 01:26:57.298843+00', NULL, '2025-10-05 01:26:57.298843+00'),
	('27834719-b87a-4a75-baae-5800244254d1', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2911', 'success', '2025-10-05 01:26:57.314814+00', NULL, '2025-10-05 01:26:57.314814+00'),
	('bf84dc9c-fb75-4e44-bb88-333699774740', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '2963', 'success', '2025-10-05 01:26:57.331292+00', NULL, '2025-10-05 01:26:57.331292+00'),
	('897aa961-13eb-4996-a712-b5f13c0aac8d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3047', 'success', '2025-10-05 01:26:57.350926+00', NULL, '2025-10-05 01:26:57.350926+00'),
	('25a84919-27f3-4c3d-8748-bb10d21cb5d4', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3140', 'success', '2025-10-05 01:26:57.367331+00', NULL, '2025-10-05 01:26:57.367331+00'),
	('aa503a03-4166-4804-b916-4eec906fa471', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3153', 'success', '2025-10-05 01:26:57.382737+00', NULL, '2025-10-05 01:26:57.382737+00'),
	('bf322ae8-1c24-4cda-8c39-d18cf7593cef', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3155', 'success', '2025-10-05 01:26:57.398606+00', NULL, '2025-10-05 01:26:57.398606+00'),
	('03a3f068-72ba-4c35-ae3b-db473054aa06', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3235', 'success', '2025-10-05 01:26:57.416093+00', NULL, '2025-10-05 01:26:57.416093+00'),
	('9df1fc42-a2c8-42b9-bad8-30c04cdb030a', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3246', 'success', '2025-10-05 01:26:57.42891+00', NULL, '2025-10-05 01:26:57.42891+00'),
	('0f932abf-f6e8-4aa7-ad03-e5ae2be70e10', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3248', 'success', '2025-10-05 01:26:57.442942+00', NULL, '2025-10-05 01:26:57.442942+00'),
	('35c4c1d5-6588-4cdf-872d-46435eecccdb', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3397', 'success', '2025-10-05 01:26:57.456776+00', NULL, '2025-10-05 01:26:57.456776+00'),
	('c2764170-7b46-419b-b44b-0558ee9b946f', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3411', 'success', '2025-10-05 01:26:57.469069+00', NULL, '2025-10-05 01:26:57.469069+00'),
	('5740c27e-c626-4fd6-8ec7-246bce7d2bcd', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3413', 'success', '2025-10-05 01:26:57.483375+00', NULL, '2025-10-05 01:26:57.483375+00'),
	('ef808c06-3157-4475-9911-2bc1de00f935', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3461', 'success', '2025-10-05 01:26:57.495633+00', NULL, '2025-10-05 01:26:57.495633+00'),
	('941adde8-7f3c-4834-837b-c62a5b089c1d', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3509', 'success', '2025-10-05 01:26:57.507747+00', NULL, '2025-10-05 01:26:57.507747+00'),
	('0ca67aef-5bef-42ba-a95e-d5169a2648ce', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3514', 'success', '2025-10-05 01:26:57.521836+00', NULL, '2025-10-05 01:26:57.521836+00'),
	('b67aa5c7-34f4-41d4-99cb-c1b1b4c708e0', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3526', 'success', '2025-10-05 01:26:57.53575+00', NULL, '2025-10-05 01:26:57.53575+00'),
	('9aa5b30e-88b8-4522-9442-17f16bb578d5', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3529', 'success', '2025-10-05 01:26:57.548669+00', NULL, '2025-10-05 01:26:57.548669+00'),
	('59e0ce12-d19e-4bef-b957-cafe4b5d3ab0', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3533', 'success', '2025-10-05 01:26:57.562483+00', NULL, '2025-10-05 01:26:57.562483+00'),
	('34b6e9da-aa5b-49f8-9833-0b56d6b7d170', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3535', 'success', '2025-10-05 01:26:57.578181+00', NULL, '2025-10-05 01:26:57.578181+00'),
	('a29c207e-67a1-4de6-a42d-0d6c4b58998e', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3537', 'success', '2025-10-05 01:26:57.594215+00', NULL, '2025-10-05 01:26:57.594215+00'),
	('5b75e8bd-d08a-441e-8717-8242ca7054cf', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3539', 'success', '2025-10-05 01:26:57.607398+00', NULL, '2025-10-05 01:26:57.607398+00'),
	('03aecd37-4cb4-42b5-8f55-9b9f31d90026', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3541', 'success', '2025-10-05 01:26:57.621875+00', NULL, '2025-10-05 01:26:57.621875+00'),
	('c07246ef-206c-4b9c-8f7a-c3d9b15b3dce', '71fbe3ec-0ab9-4b20-aec7-042e62669b0c', 'people', '3543', 'success', '2025-10-05 01:26:57.6352+00', NULL, '2025-10-05 01:26:57.6352+00'),
	('9f696026-0054-456b-9724-6bffa82c669a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '504', 'success', '2025-10-05 01:50:26.173463+00', NULL, '2025-10-05 01:50:26.173463+00'),
	('11ad2ca4-4f0f-401f-bc7c-af45b6a10520', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '505', 'success', '2025-10-05 01:50:26.181961+00', NULL, '2025-10-05 01:50:26.181961+00'),
	('529b84f7-063f-4abf-8323-fb7bcef7bc80', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '506', 'success', '2025-10-05 01:50:26.188484+00', NULL, '2025-10-05 01:50:26.188484+00'),
	('48a2535a-b75b-4b70-b511-81e440ee7314', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '507', 'success', '2025-10-05 01:50:26.194554+00', NULL, '2025-10-05 01:50:26.194554+00'),
	('515c75e3-a207-4d08-952b-7421a751d9dd', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '508', 'success', '2025-10-05 01:50:26.201552+00', NULL, '2025-10-05 01:50:26.201552+00'),
	('70b91291-279b-4b71-ae67-1e2ec0818d43', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '509', 'success', '2025-10-05 01:50:26.207179+00', NULL, '2025-10-05 01:50:26.207179+00'),
	('7931322b-7500-448a-a3a1-cab4c672778f', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '510', 'success', '2025-10-05 01:50:26.212294+00', NULL, '2025-10-05 01:50:26.212294+00'),
	('a7dd3bbf-f06c-412f-adcb-f7e92e2c24e4', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '511', 'success', '2025-10-05 01:50:26.217564+00', NULL, '2025-10-05 01:50:26.217564+00'),
	('d1023594-10d0-428b-8fbe-6b7f5136a9cf', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '512', 'success', '2025-10-05 01:50:26.223314+00', NULL, '2025-10-05 01:50:26.223314+00'),
	('e6a24110-9ccd-472c-b812-7646f80d45db', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '513', 'success', '2025-10-05 01:50:26.229074+00', NULL, '2025-10-05 01:50:26.229074+00'),
	('36a8384b-7535-4ebb-9762-ddcb52f30dfa', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '514', 'success', '2025-10-05 01:50:26.234087+00', NULL, '2025-10-05 01:50:26.234087+00'),
	('dd6b8f86-9eac-40e3-bfb0-7ea4ac563253', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '515', 'success', '2025-10-05 01:50:26.239155+00', NULL, '2025-10-05 01:50:26.239155+00'),
	('75a3e550-ba16-4fbf-a099-d4ea6a995228', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '516', 'success', '2025-10-05 01:50:26.245275+00', NULL, '2025-10-05 01:50:26.245275+00'),
	('063aef74-eb6c-4712-a3d9-6aee5c2defb9', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '517', 'success', '2025-10-05 01:50:26.250187+00', NULL, '2025-10-05 01:50:26.250187+00'),
	('f1106f46-20fc-4b67-9c91-0e874ffecf2d', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '518', 'success', '2025-10-05 01:50:26.256925+00', NULL, '2025-10-05 01:50:26.256925+00'),
	('597d2c96-a24a-46b9-9a2c-6b1a48a6a65e', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '519', 'success', '2025-10-05 01:50:26.262827+00', NULL, '2025-10-05 01:50:26.262827+00'),
	('1742a439-e4c8-48e2-bdb5-92ff7575580f', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '520', 'success', '2025-10-05 01:50:26.26761+00', NULL, '2025-10-05 01:50:26.26761+00'),
	('531eeb27-edd2-44aa-8d7d-66721691de1f', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '521', 'success', '2025-10-05 01:50:26.275059+00', NULL, '2025-10-05 01:50:26.275059+00'),
	('50385a69-7a4f-4995-9e51-3a77f2515e5a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '522', 'success', '2025-10-05 01:50:26.283534+00', NULL, '2025-10-05 01:50:26.283534+00'),
	('a2a54798-d070-4f4e-a750-5f2b5ae6f3e0', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '523', 'success', '2025-10-05 01:50:26.288755+00', NULL, '2025-10-05 01:50:26.288755+00'),
	('bf1ae5ad-6578-48c1-aad9-533f3be3999c', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '524', 'success', '2025-10-05 01:50:26.295817+00', NULL, '2025-10-05 01:50:26.295817+00'),
	('cdcc1361-dfe6-4e78-9c68-454d66f1221c', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '525', 'success', '2025-10-05 01:50:26.300758+00', NULL, '2025-10-05 01:50:26.300758+00'),
	('dc40a479-487a-45b2-8301-cb71752d0dc1', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '526', 'success', '2025-10-05 01:50:26.306258+00', NULL, '2025-10-05 01:50:26.306258+00'),
	('34b228d7-ed3e-4392-bf4a-9de41b94456c', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '527', 'success', '2025-10-05 01:50:26.311872+00', NULL, '2025-10-05 01:50:26.311872+00'),
	('01b4203d-30a4-4a26-9e94-4d91b10916e7', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1043', 'success', '2025-10-05 01:50:26.317109+00', NULL, '2025-10-05 01:50:26.317109+00'),
	('7fe0dedc-369a-4b37-9ed6-e18e676a1355', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1045', 'success', '2025-10-05 01:50:26.32191+00', NULL, '2025-10-05 01:50:26.32191+00'),
	('1f7f485b-0876-413a-9ae4-84e6bd7e6f12', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1046', 'success', '2025-10-05 01:50:26.326611+00', NULL, '2025-10-05 01:50:26.326611+00'),
	('9cb21bf3-b873-4352-b11e-3cca1a71ce4e', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1048', 'success', '2025-10-05 01:50:26.331345+00', NULL, '2025-10-05 01:50:26.331345+00'),
	('4b53b4de-a0d3-4af0-abfd-6bf6a9bf1cd9', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1049', 'success', '2025-10-05 01:50:26.337406+00', NULL, '2025-10-05 01:50:26.337406+00'),
	('afab4ffd-6ba2-42d5-bff4-e1b1a175c4d0', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1051', 'success', '2025-10-05 01:50:26.342726+00', NULL, '2025-10-05 01:50:26.342726+00'),
	('62ca8aa1-e68d-4675-8b65-6f452e4a386f', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1052', 'success', '2025-10-05 01:50:26.348394+00', NULL, '2025-10-05 01:50:26.348394+00'),
	('27e33f45-6eb6-4205-a428-df6837c63c1b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1054', 'success', '2025-10-05 01:50:26.352996+00', NULL, '2025-10-05 01:50:26.352996+00'),
	('149f6dea-4460-42e4-b70c-56336882e064', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1055', 'success', '2025-10-05 01:50:26.358113+00', NULL, '2025-10-05 01:50:26.358113+00'),
	('b9bb5856-35e0-46e3-ac2e-2a9c3c2ba830', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1056', 'success', '2025-10-05 01:50:26.362928+00', NULL, '2025-10-05 01:50:26.362928+00'),
	('a9fc00ee-bdaa-45fe-be6c-c470103fa012', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1058', 'success', '2025-10-05 01:50:26.368354+00', NULL, '2025-10-05 01:50:26.368354+00'),
	('5ce97e01-7b54-43d3-ab9f-7d0affaa160b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1061', 'success', '2025-10-05 01:50:26.373461+00', NULL, '2025-10-05 01:50:26.373461+00'),
	('743991e4-0e27-4c9e-bf5a-784b1a9bb62b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1064', 'success', '2025-10-05 01:50:26.379605+00', NULL, '2025-10-05 01:50:26.379605+00'),
	('5d93cd4d-6a0f-48bd-8b8d-a0331c7d5cb1', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1067', 'success', '2025-10-05 01:50:26.386129+00', NULL, '2025-10-05 01:50:26.386129+00'),
	('31282729-521d-43d1-aab6-447fc2211d1a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1069', 'success', '2025-10-05 01:50:26.391812+00', NULL, '2025-10-05 01:50:26.391812+00'),
	('0b7d5445-291e-4aab-b816-a17bbc8f7ae0', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1071', 'success', '2025-10-05 01:50:26.397509+00', NULL, '2025-10-05 01:50:26.397509+00'),
	('33099805-3fda-4200-ae06-3fa8ec962783', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1073', 'success', '2025-10-05 01:50:26.402919+00', NULL, '2025-10-05 01:50:26.402919+00'),
	('1e56abc9-4d26-44ad-b0fb-01117b36e6e9', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1074', 'success', '2025-10-05 01:50:26.407681+00', NULL, '2025-10-05 01:50:26.407681+00'),
	('28d27f17-a684-4dbf-930b-8d562c603467', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1076', 'success', '2025-10-05 01:50:26.413674+00', NULL, '2025-10-05 01:50:26.413674+00'),
	('95924aea-8ee8-485a-8c61-4cdf40aa6e51', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1094', 'success', '2025-10-05 01:50:26.418572+00', NULL, '2025-10-05 01:50:26.418572+00'),
	('63ec1a60-e466-4f0a-85a7-8ff740ebc1ed', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1096', 'success', '2025-10-05 01:50:26.425503+00', NULL, '2025-10-05 01:50:26.425503+00'),
	('b4ef8329-a817-4f65-8a53-951bbca410ee', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '1129', 'success', '2025-10-05 01:50:26.429909+00', NULL, '2025-10-05 01:50:26.429909+00'),
	('037d799a-c680-433b-9bd1-ea52080b3193', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2682', 'success', '2025-10-05 01:50:26.435592+00', NULL, '2025-10-05 01:50:26.435592+00'),
	('fa80aff4-e43e-403d-b225-949838349724', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2683', 'success', '2025-10-05 01:50:26.440637+00', NULL, '2025-10-05 01:50:26.440637+00'),
	('4684f8df-f88d-47b1-aefa-f6731aecc326', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2684', 'success', '2025-10-05 01:50:26.446477+00', NULL, '2025-10-05 01:50:26.446477+00'),
	('62a62e24-d1f6-4ef6-94f5-ab7bc1a8a171', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2685', 'success', '2025-10-05 01:50:26.452506+00', NULL, '2025-10-05 01:50:26.452506+00'),
	('5ec540d5-7533-4f58-bedb-b446b0ace04a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2871', 'success', '2025-10-05 01:50:26.462999+00', NULL, '2025-10-05 01:50:26.462999+00'),
	('531813f9-1384-4813-b4d8-1d2044ae5fab', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2873', 'success', '2025-10-05 01:50:26.474543+00', NULL, '2025-10-05 01:50:26.474543+00'),
	('b18b86a1-fc2b-49aa-a36d-2eefbb64d203', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2875', 'success', '2025-10-05 01:50:26.486573+00', NULL, '2025-10-05 01:50:26.486573+00'),
	('83e42e2f-af55-45c5-9f38-b1efeeb32f51', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2877', 'success', '2025-10-05 01:50:26.496489+00', NULL, '2025-10-05 01:50:26.496489+00'),
	('9c7e695a-c524-47e2-8a1b-496b22b15c0f', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2879', 'success', '2025-10-05 01:50:26.508328+00', NULL, '2025-10-05 01:50:26.508328+00'),
	('c28fae99-baad-44c6-b533-d57bf2f4d4f1', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2881', 'success', '2025-10-05 01:50:26.52108+00', NULL, '2025-10-05 01:50:26.52108+00'),
	('e6f2f443-047c-4576-aa6a-90c396cb9913', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2883', 'success', '2025-10-05 01:50:26.530308+00', NULL, '2025-10-05 01:50:26.530308+00'),
	('b015d5af-e2e2-46b7-b87d-7bdc793fb6f3', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2885', 'success', '2025-10-05 01:50:26.540105+00', NULL, '2025-10-05 01:50:26.540105+00'),
	('49f4e37d-d746-4dd7-991e-31973580ef37', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2887', 'success', '2025-10-05 01:50:26.550419+00', NULL, '2025-10-05 01:50:26.550419+00'),
	('97fa166f-9686-45a5-9cec-ea13a5b45d95', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2891', 'success', '2025-10-05 01:50:26.561477+00', NULL, '2025-10-05 01:50:26.561477+00'),
	('de298e0c-efae-48c2-9d4b-7d7d89828600', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2893', 'success', '2025-10-05 01:50:26.572949+00', NULL, '2025-10-05 01:50:26.572949+00'),
	('6cc756c6-4ec5-42fc-ab88-1955940c2b2e', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2895', 'success', '2025-10-05 01:50:26.584467+00', NULL, '2025-10-05 01:50:26.584467+00'),
	('49f25d01-df01-49dc-86b1-cc38c47cf168', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2898', 'success', '2025-10-05 01:50:26.595923+00', NULL, '2025-10-05 01:50:26.595923+00'),
	('2b6f26a2-a95f-46b9-8af1-9fea1b2557fb', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2911', 'success', '2025-10-05 01:50:26.607942+00', NULL, '2025-10-05 01:50:26.607942+00'),
	('cde62bba-5755-44d3-bac4-9e7e1b3a53f5', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2963', 'success', '2025-10-05 01:50:26.61899+00', NULL, '2025-10-05 01:50:26.61899+00'),
	('029d9104-6f07-4814-ac4c-60088070c73b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3047', 'success', '2025-10-05 01:50:26.628385+00', NULL, '2025-10-05 01:50:26.628385+00'),
	('7b7b0956-6160-4713-8380-8b65668c0b6f', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3140', 'success', '2025-10-05 01:50:26.638639+00', NULL, '2025-10-05 01:50:26.638639+00'),
	('c99e96a1-e8ed-4842-a31d-a77ab4e60c25', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3153', 'success', '2025-10-05 01:50:26.651206+00', NULL, '2025-10-05 01:50:26.651206+00'),
	('82d4a0b1-95b5-48a0-bb11-9315a64eaf0a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3155', 'success', '2025-10-05 01:50:26.661678+00', NULL, '2025-10-05 01:50:26.661678+00'),
	('c923f8f3-4ee3-4393-b7e2-3fe40f8a74d0', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3235', 'success', '2025-10-05 01:50:26.672345+00', NULL, '2025-10-05 01:50:26.672345+00'),
	('e83a68db-e44d-4f45-8f4c-b6abc902e272', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3246', 'success', '2025-10-05 01:50:26.682595+00', NULL, '2025-10-05 01:50:26.682595+00'),
	('18a34857-55ba-49e8-a694-88210c6c4fa6', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3248', 'success', '2025-10-05 01:50:26.694017+00', NULL, '2025-10-05 01:50:26.694017+00'),
	('3a282e4f-ff69-4e9b-a714-ded7bb645bc6', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3397', 'success', '2025-10-05 01:50:26.704777+00', NULL, '2025-10-05 01:50:26.704777+00'),
	('924e3b0e-88ed-4577-8027-15c43f4edf7a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3411', 'success', '2025-10-05 01:50:26.72556+00', NULL, '2025-10-05 01:50:26.72556+00'),
	('b4a11c4c-d929-4dff-87e8-f5d9f0b2fba2', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3413', 'success', '2025-10-05 01:50:26.744023+00', NULL, '2025-10-05 01:50:26.744023+00'),
	('328c6cc9-9371-484b-aafd-69e428bf16f3', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3461', 'success', '2025-10-05 01:50:26.775395+00', NULL, '2025-10-05 01:50:26.775395+00'),
	('315ede0e-dc8f-4ff1-b2e7-4e7ad9fee4d4', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3509', 'success', '2025-10-05 01:50:26.783262+00', NULL, '2025-10-05 01:50:26.783262+00'),
	('14ae000c-1766-48ae-90b5-4d5eaacfc89b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3514', 'success', '2025-10-05 01:50:26.790872+00', NULL, '2025-10-05 01:50:26.790872+00'),
	('b84ffb90-78f9-4ac1-8427-e1863a2d249a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3526', 'success', '2025-10-05 01:50:26.800631+00', NULL, '2025-10-05 01:50:26.800631+00'),
	('f720872c-f748-4cc6-b1a2-0930cd0df07d', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3529', 'success', '2025-10-05 01:50:26.80948+00', NULL, '2025-10-05 01:50:26.80948+00'),
	('a8db6d87-24b1-4ec6-9cd2-97a37ae56755', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3533', 'success', '2025-10-05 01:50:26.817506+00', NULL, '2025-10-05 01:50:26.817506+00'),
	('77921861-47f0-4baa-a8c8-0120fd9ca3af', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3535', 'success', '2025-10-05 01:50:26.825741+00', NULL, '2025-10-05 01:50:26.825741+00'),
	('6e0307dd-89f6-4e11-b2cc-23850cf456a4', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3537', 'success', '2025-10-05 01:50:26.834907+00', NULL, '2025-10-05 01:50:26.834907+00'),
	('9fcdb7e8-723d-4640-927d-64cb5d49609c', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3539', 'success', '2025-10-05 01:50:26.844301+00', NULL, '2025-10-05 01:50:26.844301+00'),
	('fdf128ef-9fcf-4731-966f-21c8b0c2d2e7', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3541', 'success', '2025-10-05 01:50:26.852171+00', NULL, '2025-10-05 01:50:26.852171+00'),
	('07eb7900-215c-4b0d-9623-55fbf8a1f060', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3543', 'success', '2025-10-05 01:50:26.861921+00', NULL, '2025-10-05 01:50:26.861921+00'),
	('a49b7fe7-d452-4dcf-9821-85bba5c4c715', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2832', 'success', '2025-10-05 01:50:26.457824+00', NULL, '2025-10-05 01:50:26.457824+00'),
	('345e44dc-aaca-4123-bb99-67a7b822ca40', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2872', 'success', '2025-10-05 01:50:26.468942+00', NULL, '2025-10-05 01:50:26.468942+00'),
	('85b7cfe7-f310-4aa5-ad0d-da41e97b7032', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2874', 'success', '2025-10-05 01:50:26.480805+00', NULL, '2025-10-05 01:50:26.480805+00'),
	('599d8444-626f-4037-9622-e7f077647458', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2876', 'success', '2025-10-05 01:50:26.491622+00', NULL, '2025-10-05 01:50:26.491622+00'),
	('561541ea-0709-491f-9360-b13870e89322', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2878', 'success', '2025-10-05 01:50:26.503011+00', NULL, '2025-10-05 01:50:26.503011+00'),
	('def46303-75ba-46ef-b3c6-ef8f98be6a33', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2880', 'success', '2025-10-05 01:50:26.514557+00', NULL, '2025-10-05 01:50:26.514557+00'),
	('fa83ee79-152b-41b2-a2b0-305ac4600e13', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2882', 'success', '2025-10-05 01:50:26.525898+00', NULL, '2025-10-05 01:50:26.525898+00'),
	('b23df96b-02d4-44e4-b355-db8cd207f910', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2884', 'success', '2025-10-05 01:50:26.53503+00', NULL, '2025-10-05 01:50:26.53503+00'),
	('85cde8b0-ff7b-4678-960b-5c97152fe196', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2886', 'success', '2025-10-05 01:50:26.545885+00', NULL, '2025-10-05 01:50:26.545885+00'),
	('a847e227-8906-4c86-9a14-911d6fbb686e', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2888', 'success', '2025-10-05 01:50:26.555242+00', NULL, '2025-10-05 01:50:26.555242+00'),
	('ba3c8c43-5402-4f75-b891-addb2f5ee81a', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2892', 'success', '2025-10-05 01:50:26.5667+00', NULL, '2025-10-05 01:50:26.5667+00'),
	('765d5f58-fe64-453c-87e2-2f273f8e45e0', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2894', 'success', '2025-10-05 01:50:26.578403+00', NULL, '2025-10-05 01:50:26.578403+00'),
	('dbb62c20-7f94-4134-9e51-2f2cbc95b4e5', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2896', 'success', '2025-10-05 01:50:26.589735+00', NULL, '2025-10-05 01:50:26.589735+00'),
	('9f760dfa-cc54-4b1a-a1ae-61950b36372b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2902', 'success', '2025-10-05 01:50:26.602694+00', NULL, '2025-10-05 01:50:26.602694+00'),
	('dd4e9bb7-6032-4a35-89cd-e28c6ef36f57', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '2912', 'success', '2025-10-05 01:50:26.613183+00', NULL, '2025-10-05 01:50:26.613183+00'),
	('876b5ba3-61c9-440b-a32e-5c5a3577dc2d', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3046', 'success', '2025-10-05 01:50:26.623753+00', NULL, '2025-10-05 01:50:26.623753+00'),
	('77c61a36-a30f-4e6f-8c5b-f6e2cd2c8c32', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3051', 'success', '2025-10-05 01:50:26.633423+00', NULL, '2025-10-05 01:50:26.633423+00'),
	('68b19869-0ed7-4bb6-b5f2-96584af19f8e', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3152', 'success', '2025-10-05 01:50:26.644962+00', NULL, '2025-10-05 01:50:26.644962+00'),
	('29b0175c-fca4-4ad1-99d0-20a9b1d9e743', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3154', 'success', '2025-10-05 01:50:26.656333+00', NULL, '2025-10-05 01:50:26.656333+00'),
	('2fa5a7dc-8e39-4e07-aaa8-f6998de73c49', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3234', 'success', '2025-10-05 01:50:26.666522+00', NULL, '2025-10-05 01:50:26.666522+00'),
	('29371ad6-1555-40c0-8265-8ccd6978bd4b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3245', 'success', '2025-10-05 01:50:26.67738+00', NULL, '2025-10-05 01:50:26.67738+00'),
	('2adce656-113a-49ab-aedf-4da2bdeb9fb1', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3247', 'success', '2025-10-05 01:50:26.688586+00', NULL, '2025-10-05 01:50:26.688586+00'),
	('ac00a7ee-7554-4a5a-9b8c-a0eb9b5e049d', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3249', 'success', '2025-10-05 01:50:26.699138+00', NULL, '2025-10-05 01:50:26.699138+00'),
	('332e6fde-acdb-4ed0-8fe1-6549e369b9e8', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3410', 'success', '2025-10-05 01:50:26.711898+00', NULL, '2025-10-05 01:50:26.711898+00'),
	('dfbca455-815a-40b7-ab50-c808e09ba610', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3412', 'success', '2025-10-05 01:50:26.735086+00', NULL, '2025-10-05 01:50:26.735086+00'),
	('8f7399da-39da-45e9-bb04-e20f8202ca5b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3414', 'success', '2025-10-05 01:50:26.770851+00', NULL, '2025-10-05 01:50:26.770851+00'),
	('d4417296-8070-490a-bea5-43aff4d9d146', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3508', 'success', '2025-10-05 01:50:26.779244+00', NULL, '2025-10-05 01:50:26.779244+00'),
	('aa1e631b-011d-43d6-ad55-f90f4c08744b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3510', 'success', '2025-10-05 01:50:26.787069+00', NULL, '2025-10-05 01:50:26.787069+00'),
	('1adc7c76-7e1c-4cfa-bee0-16c8eef8fadc', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3515', 'success', '2025-10-05 01:50:26.795559+00', NULL, '2025-10-05 01:50:26.795559+00'),
	('63cf0d7a-7564-4e6d-a8ec-dfcec165178d', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3527', 'success', '2025-10-05 01:50:26.805018+00', NULL, '2025-10-05 01:50:26.805018+00'),
	('9d2747b3-195b-48ca-9f25-407c1cc91567', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3530', 'success', '2025-10-05 01:50:26.814024+00', NULL, '2025-10-05 01:50:26.814024+00'),
	('ee88ab4e-8b50-4fca-b477-cd74fc258870', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3534', 'success', '2025-10-05 01:50:26.821778+00', NULL, '2025-10-05 01:50:26.821778+00'),
	('dc5e627e-6a08-4aa9-b37a-8d5b0f40cbd3', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3536', 'success', '2025-10-05 01:50:26.830524+00', NULL, '2025-10-05 01:50:26.830524+00'),
	('3c007106-5cad-43b8-84bb-689fb47f046f', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3538', 'success', '2025-10-05 01:50:26.84011+00', NULL, '2025-10-05 01:50:26.84011+00'),
	('13ffc56b-e271-4dea-9103-a4aa9d6ff97b', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3540', 'success', '2025-10-05 01:50:26.848293+00', NULL, '2025-10-05 01:50:26.848293+00'),
	('96ad86a0-540b-442f-9407-b6e66e5b2ca0', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3542', 'success', '2025-10-05 01:50:26.85725+00', NULL, '2025-10-05 01:50:26.85725+00'),
	('6080efe1-8562-401c-add5-9fc99206c3f5', 'ac6e959f-e5de-444e-b115-7dc293eac66d', 'people', '3544', 'success', '2025-10-05 01:50:26.867845+00', NULL, '2025-10-05 01:50:26.867845+00');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 3, true);


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

-- \unrestrict 8Cq5hN3ZgFBpQNdKeiKAmoOxnadL0hov6AImnZRkt4mRzFJYgvnlJf0vE2uvhee

RESET ALL;
