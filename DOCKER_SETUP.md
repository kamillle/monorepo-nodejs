# Docker Compose + Prisma セットアップガイド

このプロジェクトは Docker Compose を使用して、Web、API、PostgreSQL を統合的に起動できるように構成されています。

## 必要な環境

- Docker Desktop（または Docker Engine + Docker Compose）
- pnpm 10.18.0

## セットアップ手順

### 1. 環境変数ファイルの作成（ローカル開発用）

ローカルで API を実行する場合は、`.env` ファイルを作成します。

```bash
cd apps/api
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/monorepo_dev?schema=public"
EOF
```

Docker Compose で実行する場合は、環境変数が `docker-compose.yml` で設定されているため、この手順は不要です。

### 2. Docker Compose でサービスを起動

```bash
# すべてのサービスをビルドして起動
docker-compose up --build

# またはバックグラウンドで起動
docker-compose up -d --build
```

これにより、以下のサービスが起動します：

- **PostgreSQL**: `localhost:5432`
- **API**: `localhost:3001`
- **Web**: `localhost:3000`

### 3. データベースのマイグレーション

初回起動時には、データベースのマイグレーションを実行する必要があります。

```bash
# API コンテナ内でマイグレーションを実行
docker-compose exec api pnpm --filter api prisma migrate dev --name init

# または、ローカルから実行（PostgreSQL が起動している必要があります）
cd apps/api
pnpm prisma migrate dev --name init
```

### 4. データベースのシード（サンプルデータ投入）

マイグレーション後、シードを実行してサンプルデータを投入します。

```bash
# API コンテナ内でシードを実行
docker-compose exec api pnpm --filter api prisma db seed

# または、ローカルから実行
cd apps/api
pnpm prisma db seed
```

## 使用方法

### サービスの確認

- **Web（フロントエンド）**: http://localhost:3000
- **API（バックエンド）**: http://localhost:3001
- **Swagger API ドキュメント**: http://localhost:3001/api

### 開発時のコマンド

```bash
# ログを確認
docker-compose logs -f

# 特定のサービスのログを確認
docker-compose logs -f api

# サービスを停止
docker-compose down

# サービスを停止してボリュームも削除（データベースの内容も削除されます）
docker-compose down -v

# コンテナに入る
docker-compose exec api sh
docker-compose exec web sh

# Prisma Studio を起動（データベースの GUI 管理ツール）
docker-compose exec api pnpm --filter api prisma studio
# ブラウザで http://localhost:5555 を開く
```

### ローカル開発（Docker を使わない場合）

Docker を使わずにローカルで開発する場合：

```bash
# PostgreSQL のみ Docker で起動
docker-compose up -d postgres

# ルートディレクトリで依存関係をインストール
pnpm install

# マイグレーションとシードを実行
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed

# ルートディレクトリに戻って開発サーバーを起動
cd ../..
pnpm dev
```

## Prisma の操作

### マイグレーション

```bash
# 新しいマイグレーションを作成
docker-compose exec api pnpm --filter api prisma migrate dev --name <migration-name>

# マイグレーションをリセット（データベースを初期化）
docker-compose exec api pnpm --filter api prisma migrate reset
```

### Prisma Client の再生成

スキーマを変更した後は、Prisma Client を再生成する必要があります。

```bash
docker-compose exec api pnpm --filter api prisma generate
```

### Prisma Studio の起動

```bash
docker-compose exec api pnpm --filter api prisma studio
```

ブラウザで http://localhost:5555 を開いてデータベースを GUI で操作できます。

## トラブルシューティング

### ポートがすでに使用されている

他のアプリケーションがポート 3000、3001、5432 を使用している場合、`docker-compose.yml` のポート設定を変更してください。

### データベース接続エラー

PostgreSQL の起動を待ってから API が起動するように設定されていますが、それでもエラーが発生する場合は、以下を試してください：

```bash
# サービスを停止
docker-compose down

# PostgreSQL だけを先に起動
docker-compose up -d postgres

# 10秒ほど待ってから API と Web を起動
docker-compose up api web
```

### ボリュームのリセット

データベースの内容をリセットしたい場合：

```bash
docker-compose down -v
docker-compose up -d postgres
# マイグレーションとシードを再実行
docker-compose exec api pnpm --filter api prisma migrate dev
docker-compose exec api pnpm --filter api prisma db seed
```

## プロジェクト構成

```
monorepo-nodejs/
├── docker-compose.yml          # Docker Compose 設定
├── apps/
│   ├── api/
│   │   ├── Dockerfile          # API 用 Dockerfile
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Prisma スキーマ
│   │   │   └── seed.ts         # シードデータ
│   │   └── src/
│   │       ├── prisma/         # Prisma モジュール
│   │       └── products/       # Products モジュール
│   └── frontend/
│       └── Dockerfile          # Frontend 用 Dockerfile
└── packages/
    └── contract/               # 共有型定義
```

## 参考リンク

- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Docker Compose ドキュメント](https://docs.docker.com/compose/)
- [NestJS ドキュメント](https://docs.nestjs.com/)
- [Next.js ドキュメント](https://nextjs.org/docs)
