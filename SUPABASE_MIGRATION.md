# Supabase Migration Guide

## 概要
このプロジェクトでは、peopleデータをSupabaseに移行しました。

## 完了した作業

### 1. Supabase CLIのセットアップ
- Supabase CLIをインストール
- プロジェクトの初期化 (`supabase init`)
- 既存のSupabaseプロジェクトにリンク

### 2. データベーススキーマの作成
- `people`テーブルのマイグレーションファイルを作成
- Row Level Security (RLS) の設定
- 自動更新トリガーの設定

### 3. データの移行
- 既存のpeopleデータ（20件）をSupabaseに移行
- データの整合性確認

### 4. アプリケーションの更新
- Supabaseクライアントの設定
- peopleデータ取得用のAPI関数を作成
- フロントエンドの更新（ローディング状態、エラーハンドリング）

## 環境変数の設定

アプリケーションを動作させるために、以下の環境変数を設定してください：

```bash
# .env.local ファイルを作成
NEXT_PUBLIC_SUPABASE_URL=https://afqiufwmrahkautvsfcv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcWl1ZndtcmFoa2F1dHZzZmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NTc3MjUsImV4cCI6MjA3MzEzMzcyNX0.IIEdefiCIx7fHfMNTu_T5Gn8v6DQasBTKDUMYBGZCBg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcWl1ZndtcmFoa2F1dHZzZmN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU1NzcyNSwiZXhwIjoyMDczMTMzNzI1fQ.erxUsC6TTDA8_LkyPbFU8J1OwaIejGmiiZOzLtEOQto
```

## データベース構造

### peopleテーブル
```sql
CREATE TABLE people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kana TEXT,
  nationality TEXT,
  dob DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  company TEXT,
  note TEXT,
  visa_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 作成されたファイル

- `supabase/migrations/20250912050848_create_people_table.sql` - テーブル作成マイグレーション
- `supabase/seed_people_data.sql` - データ挿入用SQL
- `lib/supabase/people.ts` - Supabase用のAPI関数
- `scripts/migrate-people.js` - データ移行スクリプト
- `scripts/verify-data.js` - データ確認スクリプト
- `scripts/people-data.json` - 移行用データファイル

## 次のステップ

1. 他のデータ（visas、meetings、support-actions）も同様にSupabaseに移行
2. 認証機能の実装
3. リアルタイム機能の追加
4. データのバックアップ戦略の確立

## トラブルシューティング

### データが表示されない場合
1. 環境変数が正しく設定されているか確認
2. Supabaseプロジェクトがアクティブか確認
3. ブラウザのコンソールでエラーメッセージを確認

### データベース接続エラーの場合
1. SupabaseプロジェクトのURLとキーが正しいか確認
2. ネットワーク接続を確認
3. Supabaseのサービス状況を確認
