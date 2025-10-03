# monorepo-nodejs リポジトリ構成

## 概要

このリポジトリは、pnpm と Turborepo を使用した Node.js モノレポ構成です。
NestJS バックエンド API と Next.js フロントエンド、共有パッケージで構成されています。

## 技術スタック

- **パッケージマネージャー**: pnpm 10.18.0
- **ビルドシステム**: Turborepo 2.5.8
- **言語**: TypeScript

## ディレクトリ構成

```
monorepo-nodejs/
├── apps/
│   ├── api/          # NestJS バックエンド API
│   └── frontend/     # Next.js フロントエンド
├── packages/
│   └── shared/       # 共有型定義・ユーティリティ
├── package.json      # ルート package.json
├── pnpm-workspace.yaml
└── turbo.json        # Turborepo 設定
```

## アプリケーション詳細

### 1. apps/api (NestJS バックエンド)

**ポート**: 3001
**主な依存関係**:

- @nestjs/common, @nestjs/core, @nestjs/platform-express (v11.0.1)
- @repo/shared (ワークスペース内パッケージ)

**実装されている機能**:

- `/` - アプリケーション基本エンドポイント (AppController)
- `/products` - 商品一覧取得 API (ProductsController)

**構成**:

```
src/
├── main.ts                  # アプリケーションエントリーポイント（ポート3001、CORS有効）
├── app.module.ts            # ルートモジュール
├── app.controller.ts        # 基本コントローラー
├── app.service.ts           # 基本サービス
├── products.controller.ts   # 商品関連コントローラー
└── products.service.ts      # 商品関連サービス
```

**スクリプト**:

- `pnpm dev` - 開発サーバー起動（watch モード）
- `pnpm build` - プロダクションビルド
- `pnpm test` - テスト実行

### 2. apps/frontend (Next.js フロントエンド)

**ポート**: 3000
**主な依存関係**:

- next (v15.5.4)
- react, react-dom (v19.1.0)
- @repo/shared (ワークスペース内パッケージ)
- tailwindcss (v4) - スタイリング

**実装されている機能**:

- 商品一覧表示ページ
- バックエンド API (`http://localhost:3001/products`) からデータ取得
- 型安全な API レスポンス処理

**構成**:

```
app/
├── layout.tsx       # ルートレイアウト
├── page.tsx         # トップページ（商品一覧表示）
└── globals.css      # グローバルスタイル
```

**スクリプト**:

- `pnpm dev` - 開発サーバー起動（Turbopack 使用）
- `pnpm build` - プロダクションビルド
- `pnpm start` - プロダクションサーバー起動

### 3. packages/shared (共有パッケージ)

**パッケージ名**: @repo/shared
**役割**: アプリケーション間で共有する型定義・ユーティリティの提供

**エクスポートされる型・関数**:

```typescript
// 関数
function greet(name: string): string;

// 型定義
interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

interface GetProductsResponse {
  products: Product[];
  total: number;
}
```

**ビルド出力**:

- `dist/index.js` - コンパイル済み JavaScript
- `dist/index.d.ts` - TypeScript 型定義ファイル

**スクリプト**:

- `pnpm dev` - TypeScript watch モード
- `pnpm build` - TypeScript ビルド

## ワークスペース設定

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json

**タスク設定**:

- `dev`: キャッシュ無効、永続的タスク
- `build`: 出力先は `dist/**` と `.next/**`

## 主要スクリプト（ルートレベル）

```bash
pnpm dev      # 全アプリケーションの開発サーバー起動
pnpm build    # 全アプリケーションのビルド
```

Turborepo により、依存関係を考慮した並列実行が行われます。

## アプリケーション間の連携

1. **型の共有**:

   - `packages/shared` で定義された型を、`api` と `frontend` の両方で利用
   - 例: `Product`, `GetProductsResponse` インターフェース

2. **API 通信**:

   - フロントエンド → バックエンド: `http://localhost:3001/products`
   - バックエンドは CORS を有効化して `http://localhost:3000` からのアクセスを許可

3. **開発フロー**:
   - `packages/shared` の変更は自動的に `api` と `frontend` に反映される（watch モード利用時）
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
cd packages/shared && pnpm dev
```

## 注意事項

- バックエンド API は開発環境でポート 3001 で起動します
- フロントエンドは開発環境でポート 3000 で起動します
- 共有パッケージを変更した場合は、ビルドまたは watch モードが必要です
- CORS 設定は開発環境用のため、本番環境では適切に設定する必要があります
