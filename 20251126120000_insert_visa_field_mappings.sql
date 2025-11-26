-- Insert visa status date field mappings for multiple connectors/app_mappings
-- This migration inserts only the newly added visa status date fields (8 fields) for 10 connector/app_mapping combinations
-- Other fields are already configured, so we only insert the new status date fields

-- Target connector_id and app_mapping_id combinations
-- ffe9b2a0-c6d4-47ef-865f-c76cc038bee5 / 23548845-c23d-4a34-92dc-3a172f59a6b1
-- 00818946-737b-47a5-a166-650d04bca430 / 7c82aa30-82e9-498d-a556-804939a916cf
-- a053c91d-a49f-4c86-8db8-07f25564a7d4 / 205dcfad-17a3-47b6-9540-dbf602541dd1
-- 3fd2b0bf-e863-4e69-bd69-a0052506401d / 59a36dff-8523-4285-9631-a04593445d6f
-- 0e10dccc-5ba6-49e2-b33f-737254a4cf0f / 0b29daff-a3bd-4cef-b3b9-b48628dd9cba
-- 01ea067f-1531-49e3-94d2-3d028c832e08 / a65e317e-31a3-4e89-bca4-69bda644a600
-- c81a919a-1f18-416f-ace7-b4f6175f855f / 7468d4b8-ef4d-458f-801b-6f863a34c946
-- 7f9feaad-2b67-4ea3-b221-b79870437477 / 2b21ce10-bb95-4aa7-9909-57d18e767971
-- 862d970d-1bea-4fd2-a240-b7a34c9a4d64 / 46af955e-54d8-4b90-bec6-474a25cbb875
-- 08dbc182-ad77-41ca-9024-46e96659d823 / 09411ef9-e183-4e8c-a425-2df178f31da6

INSERT INTO connector_field_mappings (
  id,
  connector_id,
  app_mapping_id,
  source_field_id,
  source_field_code,
  source_field_name,
  source_field_type,
  target_field_id,
  target_field_code,
  target_field_name,
  target_field_type,
  is_required,
  is_active,
  sort_order,
  created_at,
  updated_at,
  is_update_key
) VALUES
-- Connector 1: ffe9b2a0-c6d4-47ef-865f-c76cc038bee5 / 23548845-c23d-4a34-92dc-3a172f59a6b1
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), 'ffe9b2a0-c6d4-47ef-865f-c76cc038bee5', '23548845-c23d-4a34-92dc-3a172f59a6b1', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 2: 00818946-737b-47a5-a166-650d04bca430 / 7c82aa30-82e9-498d-a556-804939a916cf
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), '00818946-737b-47a5-a166-650d04bca430', '7c82aa30-82e9-498d-a556-804939a916cf', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 3: a053c91d-a49f-4c86-8db8-07f25564a7d4 / 205dcfad-17a3-47b6-9540-dbf602541dd1
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), 'a053c91d-a49f-4c86-8db8-07f25564a7d4', '205dcfad-17a3-47b6-9540-dbf602541dd1', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 4: 3fd2b0bf-e863-4e69-bd69-a0052506401d / 59a36dff-8523-4285-9631-a04593445d6f
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), '3fd2b0bf-e863-4e69-bd69-a0052506401d', '59a36dff-8523-4285-9631-a04593445d6f', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 5: 0e10dccc-5ba6-49e2-b33f-737254a4cf0f / 0b29daff-a3bd-4cef-b3b9-b48628dd9cba
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), '0e10dccc-5ba6-49e2-b33f-737254a4cf0f', '0b29daff-a3bd-4cef-b3b9-b48628dd9cba', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 6: 01ea067f-1531-49e3-94d2-3d028c832e08 / a65e317e-31a3-4e89-bca4-69bda644a600
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), '01ea067f-1531-49e3-94d2-3d028c832e08', 'a65e317e-31a3-4e89-bca4-69bda644a600', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 7: c81a919a-1f18-416f-ace7-b4f6175f855f / 7468d4b8-ef4d-458f-801b-6f863a34c946
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), 'c81a919a-1f18-416f-ace7-b4f6175f855f', '7468d4b8-ef4d-458f-801b-6f863a34c946', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 8: 7f9feaad-2b67-4ea3-b221-b79870437477 / 2b21ce10-bb95-4aa7-9909-57d18e767971
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), '7f9feaad-2b67-4ea3-b221-b79870437477', '2b21ce10-bb95-4aa7-9909-57d18e767971', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 9: 862d970d-1bea-4fd2-a240-b7a34c9a4d64 / 46af955e-54d8-4b90-bec6-474a25cbb875
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), '862d970d-1bea-4fd2-a240-b7a34c9a4d64', '46af955e-54d8-4b90-bec6-474a25cbb875', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false),

-- Connector 10: 08dbc182-ad77-41ca-9024-46e96659d823 / 09411ef9-e183-4e8c-a425-2df178f31da6
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', '書類準備中', '書類準備中', '書類準備中', 'DATE', 'document_preparation_date', 'document_preparation_date', null, null, false, true, 6, now(), now(), false),
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', '書類作成中', '書類作成中', '書類作成中', 'DATE', 'document_creation_date', 'document_creation_date', null, null, false, true, 7, now(), now(), false),
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', '書類確認中', '書類確認中', '書類確認中', 'DATE', 'document_confirmation_date', 'document_confirmation_date', null, null, false, true, 8, now(), now(), false),
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', '申請準備中', '申請準備中', '申請準備中', 'DATE', 'application_preparation_date', 'application_preparation_date', null, null, false, true, 9, now(), now(), false),
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', 'ビザ申請準備中', 'ビザ申請準備中', 'ビザ申請準備中', 'DATE', 'visa_application_preparation_date', 'visa_application_preparation_date', null, null, false, true, 10, now(), now(), false),
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', '申請中', '申請中', '申請中', 'DATE', 'application_date', 'application_date', null, null, false, true, 11, now(), now(), false),
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', '追加書類', '追加書類', '追加書類', 'DATE', 'additional_documents_date', 'additional_documents_date', null, null, false, true, 12, now(), now(), false),
(gen_random_uuid(), '08dbc182-ad77-41ca-9024-46e96659d823', '09411ef9-e183-4e8c-a425-2df178f31da6', 'ビザ取得済み', 'ビザ取得済み', 'ビザ取得済み', 'DATE', 'visa_acquired_date', 'visa_acquired_date', null, null, false, true, 13, now(), now(), false);
