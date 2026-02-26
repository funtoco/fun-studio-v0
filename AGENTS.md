# AGENTS.md - FunBase

## リポジトリの目的

# FunBase

外国人人材の進捗と面談記録を管理するNext.jsアプリケーションです。

## 機能概要

## プロジェクト構造

```
fun-base/
├── src/                    # ソースコード
├── supabase/              # git submodule (funtoco/fun-base-infra)
│   ├── config.toml        # Supabase設定
│   ├── migrations/        # DBマイグレーション
│   ├── seed.sql           # シードデータ
│   └── seed_people_data.sql
├── package.json           # npm依存関係
└── README.md              # プロジェクトドキュメント
```

> **Note:** `supabase/` は git submodule です。`funtoco/fun-base-infra` リポジトリを参照しています。

## 技術スタック

- 詳細はREADME.mdおよびpackage.jsonを参照

## 開発時の注意点

### 開発フロー

1. **セットアップ**
   ```bash
   git submodule update --init   # supabase/ submodule を取得
   npm install                    # 依存関係インストール
   ```

2. **ビルド/実行**
   - README.mdの指示に従ってください

## デバッグ方法

- ログ出力を確認
- 開発者ツールを使用

## ライセンス

© 株式会社Funtoco
