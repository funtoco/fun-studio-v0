create or replace function create_connector(tenant_id uuid, provider text, display_name text, company_id text)
returns uuid
language plpgsql
as $$
declare
    connector_id uuid;
    app_mapping_id_30 uuid;
    app_mapping_id_13 uuid;
    app_mapping_id_50 uuid;
    data_mapping_id uuid;
begin
    insert into connectors
        (tenant_id, provider, display_name, created_at, updated_at)
    values 
        (create_connector.tenant_id, create_connector.provider, create_connector.display_name, now(), now())
    returning id into connector_id;

    insert into credentials
        (connector_id, type, created_at, updated_at, format, payload)
    values
        (connector_id, 'kintone_config', now(), now(), 'plain','{"domain":"https://funtoco.cybozu.com","clientId":"l.1.sjxcgeg6zxdo1i267m57ss4r8gzti2go","clientSecret":"max0pn4pwxxhun6rh7z76dv7360ai7dkz9fqg9nu07l9tk7n55z7jntnk4ko5alw","scope":["k:app_record:read","k:app_settings:read"]}'),
        (connector_id, 'kintone_token', now(), now(), NULL,'{"access_token":"1.t9UE8hEDfJt3S2yjtUGDbBxwdZ0jq-yT6WE_ApvPUD6aLaK2","refresh_token":"1.dfx43uV1NZ7-YPCbUeeM_6LZX5RmJ5ur5Ik-kabUjka0hRoZ","expires_at":1759740746311,"scope":"k:app_record:read k:app_settings:read k:file:read"}');

    insert into connection_status
        (connector_id, status, updated_at)
    values
        (connector_id, 'connected', now());

    insert into connector_app_mappings
        (connector_id, source_app_id, source_app_name, target_app_type, is_active, created_at, 
        updated_at, skip_if_no_update_target) 
    values 
        (connector_id, '13', 'Kintone app 13', 'people', TRUE, now(), now(), FALSE)
    returning id into app_mapping_id_13;

    insert into connector_app_mappings
        (connector_id, source_app_id, source_app_name, target_app_type, is_active, created_at, 
        updated_at, skip_if_no_update_target) 
    values 
        (connector_id, '30', 'Kintone app 30', 'people', TRUE, now(), now(), TRUE)
    returning id into app_mapping_id_30;

    insert into connector_app_mappings
        (connector_id, source_app_id, source_app_name, target_app_type, is_active, created_at, 
        updated_at, skip_if_no_update_target) 
    values 
        (connector_id, '50', 'Kintone app 50', 'visas', TRUE, now(), now(), FALSE)
    returning id into app_mapping_id_50;

    insert into connector_app_filters 
        (connector_id, app_mapping_id, field_code, field_name, 
        field_type, filter_value, is_active, created_at, updated_at)
    values
        (connector_id, app_mapping_id_13, 'COID', '法人ID', 'NUMBER', create_connector.company_id, TRUE, now(), now()),
        (connector_id, app_mapping_id_50, 'COID', '法人ID', 'NUMBER', create_connector.company_id, TRUE, now(), now());

    insert into connector_field_mappings 
        (connector_id, app_mapping_id, source_field_id, source_field_code, source_field_name,
         source_field_type, target_field_id, target_field_code, target_field_name, target_field_type,
          is_required, is_active, sort_order, created_at, updated_at, is_update_key)
    values 
        /** 就労 **/
        (connector_id, app_mapping_id_13, '$id', '$id', '$id', 'UNKNOWN', 'id', 'id', NULL, NULL, false, TRUE, 0, now(), now(), TRUE),
        (connector_id, app_mapping_id_13, 'name', 'name', '人材名', 'SINGLE_LINE_TEXT', 'name', 'name', NULL, NULL, false, TRUE, 1, now(), now(), false),
        (connector_id, app_mapping_id_13, 'furigana', 'furigana', '呼び名（フリガナ）', 'SINGLE_LINE_TEXT', 'kana', 'kana', NULL, NULL, false, TRUE, 2, now(), now(), false),
        (connector_id, app_mapping_id_13, 'country', 'country', '国籍', 'DROP_DOWN', 'nationality', 'nationality', NULL, NULL, false, TRUE, 3, now(), now(), false),
        (connector_id, app_mapping_id_13, 'dateOfBirth', 'dateOfBirth', '生年月日', 'DATE', 'dob', 'dob', NULL, NULL, false, TRUE, 4, now(), now(), false),
        (connector_id, app_mapping_id_13, 'phoneNumber', 'phoneNumber', '電話番号', 'SINGLE_LINE_TEXT', 'phone', 'phone', NULL, NULL, false, TRUE, 5, now(), now(), false),
        (connector_id, app_mapping_id_13, 'address', 'address', '住所', 'SINGLE_LINE_TEXT', 'address', 'address', NULL, NULL, false, TRUE, 6, now(), now(), false),
        (connector_id, app_mapping_id_13, 'workingStatus', 'workingStatus', '就労ステータス (営業のみ)', 'DROP_DOWN', 'working_status', 'working_status', NULL, NULL, false, TRUE, 7, now(), now(), false),
        (connector_id, app_mapping_id_13, 'latestResidenceCardNo', 'latestResidenceCardNo', '在留カード番号', 'SINGLE_LINE_TEXT', 'residence_card_no', 'residence_card_no', NULL, NULL, false, TRUE, 8, now(), now(), false),
        (connector_id, app_mapping_id_13, 'latestResidenceCardExpirationDate', 'latestResidenceCardExpirationDate', '在留期限', 'DATE', 'residence_card_issued_date', 'residence_card_issued_date', NULL, NULL, false, TRUE, 9, now(), now(), false),
        (connector_id, app_mapping_id_13, 'HRID', 'HRID', '人材ID', 'NUMBER', 'external_id', 'external_id', NULL, NULL, false, TRUE, 10, now(), now(), false),
        /** 画像 **/
        (connector_id, app_mapping_id_30, '$id', '$id', '$id', 'UNKNOWN', 'external_id', 'external_id', NULL, NULL, false, TRUE, 0, now(), now(), TRUE),
        (connector_id, app_mapping_id_30, 'image', 'image', '写真 (営業 / CA)', 'FILE', 'image_path', 'image_path', NULL, NULL, false, TRUE, 1, now(), now(), false),
        /** ビザ **/
        (connector_id, app_mapping_id_50, '$id', '$id', '$id', 'UNKNOWN', 'id', 'id', NULL, NULL, false, TRUE, 0, now(), now(), TRUE),
        (connector_id, app_mapping_id_50, 'WOID', 'WOID', '就労管理ID', 'NUMBER', 'person_id', 'person_id', NULL, NULL, false, TRUE, 1, now(), now(), false),
        (connector_id, app_mapping_id_50, 'ステータス', 'ステータス', 'ステータス', 'STATUS', 'status', 'status', NULL, NULL, false, TRUE, 2, now(), now(), false),
        (connector_id, app_mapping_id_50, 'requestType', 'requestType', '申請種類 (営業)', 'DROP_DOWN', 'type', 'type', NULL, NULL, false, TRUE, 3, now(), now(), false),
        (connector_id, app_mapping_id_50, 'latestResidenceCardExpirationDate', 'latestResidenceCardExpirationDate', '申請前：在留期限 (支援のみ)', 'DATE', 'expiry_date', 'expiry_date', NULL, NULL, false, TRUE, 4, now(), now(), false),
        (connector_id, app_mapping_id_50, '更新日時', '更新日時', '更新日時', 'UPDATED_TIME', 'submitted_at', 'submitted_at', NULL, NULL, false, TRUE, 5, now(), now(), false);

    insert into data_mappings 
        (app_mapping_id, field_name, field_type, is_active, created_at, updated_at)
    values 
        ( app_mapping_id_50, 'status', 'string', TRUE, now(), now())
    returning id into data_mapping_id;

    insert into field_value_mappings 
        (data_mapping_id, source_value, target_value, is_active, sort_order, created_at, updated_at)
    VALUES
        (data_mapping_id, '営業_企業情報待ち', '書類準備中', TRUE, 0, now(), now()),
        (data_mapping_id, '新規_企業情報待ち', '書類準備中', TRUE, 1, now(), now()),
        (data_mapping_id, '既存_企業情報待ち', '書類準備中', TRUE, 2, now(), now()),
        (data_mapping_id, '支援_更新案内・人材情報更新待ち', '書類準備中', TRUE, 3, now(), now()),
        (data_mapping_id, 'OP_企業書類作成中', '書類作成中', TRUE, 0, now(), now()),
        (data_mapping_id, '営業_企業に確認してください', '書類確認中', TRUE, 0, now(), now()),
        (data_mapping_id, '新規_企業に確認してください', '書類確認中', TRUE, 1, now(), now()),
        (data_mapping_id, '既存_企業に確認してください', '書類確認中', TRUE, 2, now(), now()),
        (data_mapping_id, 'OP_企業に確認してください', '書類確認中', TRUE, 3, now(), now()),
        (data_mapping_id, '新規_企業_書類確認待ち', '書類確認中', TRUE, 4, now(), now()),
        (data_mapping_id, '既存_企業_書類確認待ち', '書類確認中', TRUE, 5, now(), now()),
        (data_mapping_id, '企業_書類確認待ち（新規）', '書類確認中', TRUE, 6, now(), now()),
        (data_mapping_id, '企業_書類確認待ち（更新）', '書類確認中', TRUE, 7, now(), now()),
        (data_mapping_id, 'OP_書類修正中', '書類確認中', TRUE, 8, now(), now()),
        (data_mapping_id, 'OP_押印書類送付準備中', '申請準備中', TRUE, 0, now(), now()),
        (data_mapping_id, 'OP_押印書類受取待ち', '申請準備中', TRUE, 1, now(), now()),
        (data_mapping_id, 'OP_申請人サイン書類準備中', '申請準備中', TRUE, 2, now(), now()),
        (data_mapping_id, '支援_申請人サイン待ち', '申請準備中', TRUE, 3, now(), now()),
        (data_mapping_id, 'OP_申請人サイン書類受取待ち', '申請準備中', TRUE, 4, now(), now()),
        (data_mapping_id, 'ビザ申請準備中', 'ビザ申請準備中', TRUE, 0, now(), now()),
        (data_mapping_id, 'ビザ申請待ち', 'ビザ申請準備中', TRUE, 1, now(), now()),
        (data_mapping_id, '申請中', '申請中', TRUE, 0, now(), now()),
        (data_mapping_id, '追加修正対応中', '(追加書類)', TRUE, 0, now(), now()),
        (data_mapping_id, '本人案内待ち', 'ビザ取得済み', TRUE, 0, now(), now()),
        (data_mapping_id, '在留カード情報待ち', 'ビザ取得済み', TRUE, 1, now(), now()),
        (data_mapping_id, '許可', 'ビザ取得済み', TRUE, 2, now(), now());

    return connector_id;
end;
$$