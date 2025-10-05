# monorepo-nodejs リポジトリ構成

## 概要

このリポジトリは、pnpm と Turborepo を使用した Node.js モノレポ構成です。
NestJS バックエンド API と Next.js フロントエンド、共有パッケージで構成されています。

## 技術スタック

- **パッケージマネージャー**: pnpm@10.18.0
- **ビルドシステム**: Turborepo 2.5.8
- **言語**: TypeScript

## ディレクトリ構成

```
monorepo-nodejs/
├── .gitignore
├── .husky/
│   ├── _/
│   └── pre-commit
├── AGENTS.md
├── apps/
│   ├── api/
│   └── frontend/
├── package.json
├── packages/
│   └── contract/
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── scripts/
│   ├── README.md
│   └── update-agents-md.mjs
└── turbo.json
```

## アプリケーション詳細

### 1. apps/api (NestJS バックエンド)

**ポート**: 3001
**主な依存関係**:

- @nestjs/common (^11.0.1)
- @nestjs/core (^11.0.1)
- @nestjs/platform-express (^11.0.1)
- @nestjs/swagger (^11.2.0)
- @repo/contract (workspace:*)

**実装されている機能**:

- `/` - アプリケーション基本エンドポイント (AppController)
- `/products` - 商品一覧取得 API (ProductsController)

**構成**:

```
src/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
└── products/
```

**スクリプト**:

- `pnpm build` - nest build
- `pnpm dev` - nest start --watch
- `pnpm start` - nest start
- `pnpm test` - jest

### 2. apps/frontend (Next.js フロントエンド)

**ポート**: 3000
**主な依存関係**:

- @calcom/embed-react (^1.5.3)
- @repo/contract (workspace:*)
- next (15.5.4)
- react (19.1.0)
- react-dom (19.1.0)

**実装されている機能**:

- 商品一覧表示ページ
- バックエンド API (`http://localhost:3001/products`) からデータ取得
- 型安全な API レスポンス処理

**構成**:

```
app/
├── calcom/
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx
```

**スクリプト**:

- `pnpm dev` - next dev --turbopack -p 3000
- `pnpm build` - next build --turbopack
- `pnpm start` - next start
- `pnpm lint` - eslint

### 3. packages/contract (共有パッケージ)

**パッケージ名**: @repo/contract
**役割**: アプリケーション間で共有する型定義・ユーティリティの提供

**エクスポートされる型・関数**:

```typescript
// 共有パッケージから提供される型定義
// 詳細は packages/contract/src/index.ts を参照
```

**ビルド出力**:

- `dist/index.js` - コンパイル済み JavaScript
- `dist/index.d.ts` - TypeScript 型定義ファイル

**スクリプト**:



## ワークスペース設定

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'

```

### turbo.json

**タスク設定**:

- `dev`: キャッシュ無効、永続的タスク
- `build`: 出力先: dist/**, .next/**

## 主要スクリプト（ルートレベル）

```bash
pnpm dev      # turbo run dev
pnpm build      # turbo run build
pnpm test      # echo "Error: no test specified" && exit 1
pnpm prepare      # husky
```

Turborepo により、依存関係を考慮した並列実行が行われます。

## アプリケーション間の連携

1. **型の共有**:

   - `packages/contract` で定義された型を、`api` と `frontend` の両方で利用
   - 例: `Product`, `GetProductsResponse` インターフェース

2. **API 通信**:

   - フロントエンド → バックエンド: `http://localhost:3001/products`
   - バックエンドは CORS を有効化して `http://localhost:3000` からのアクセスを許可

3. **開発フロー**:
   - `packages/contract` の変更は自動的に `api` と `frontend` に反映される（watch モード利用時）
   - 型安全性により、API の変更がフロントエンドに即座に伝播

## セットアップ方法

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動（全アプリケーション）
pnpm dev

# または個別起動
cd apps/api && pnpm dev
cd apps/frontend && pnpm dev
cd packages/contract && pnpm dev
```

## 注意事項

- バックエンド API は開発環境でポート 3001 で起動します
- フロントエンドは開発環境でポート 3000 で起動します
- 共有パッケージを変更した場合は、ビルドまたは watch モードが必要です
- CORS 設定は開発環境用のため、本番環境では適切に設定する必要があります

---

*このファイルは pre-commit フックにより自動生成されます*
