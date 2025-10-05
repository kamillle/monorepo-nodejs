# NestJS API

このディレクトリには、NestJSベースのバックエンドAPIが含まれています。

## 構成

### Feature Module アーキテクチャ

このAPIは、NestJSのベストプラクティスに従い、機能ごとにモジュールを分離した**Feature Module**アーキテクチャを採用しています。

```
src/
├── main.ts                    # アプリケーションエントリーポイント
├── app.module.ts              # ルートモジュール
├── app.controller.ts          # アプリケーション基本コントローラー
├── app.service.ts             # アプリケーション基本サービス
└── products/                  # Products フィーチャーモジュール
    ├── index.ts               # モジュールエクスポート
    ├── products.module.ts     # Products モジュール定義
    ├── products.controller.ts # Products コントローラー
    └── products.service.ts    # Products サービス
```

### Feature Module のメリット

1. **関心の分離**: 機能ごとにファイルを整理し、コードの可読性と保守性を向上
2. **再利用性**: モジュールを他のプロジェクトで簡単に再利用可能
3. **テストの容易性**: 機能単位でテストを分離しやすい
4. **スケーラビリティ**: 新しい機能を追加する際、既存コードへの影響を最小限に
5. **依存性の明確化**: モジュール間の依存関係が明確

### 新しい Feature Module の追加方法

1. **ディレクトリを作成**:

   ```bash
   mkdir -p src/新機能名
   ```

2. **必要なファイルを作成**:

   ```bash
   # モジュール
   touch src/新機能名/新機能名.module.ts
   # コントローラー
   touch src/新機能名/新機能名.controller.ts
   # サービス
   touch src/新機能名/新機能名.service.ts
   # エクスポート用index
   touch src/新機能名/index.ts
   ```

3. **モジュールを実装**:

   ```typescript
   // src/新機能名/新機能名.module.ts
   import { Module } from '@nestjs/common';
   import { 新機能名Controller } from './新機能名.controller';
   import { 新機能名Service } from './新機能名.service';

   @Module({
     controllers: [新機能名Controller],
     providers: [新機能名Service],
     exports: [新機能名Service], // 他のモジュールで使う場合
   })
   export class 新機能名Module {}
   ```

4. **app.module.ts に登録**:

   ```typescript
   import { 新機能名Module } from './新機能名';

   @Module({
     imports: [ProductsModule, 新機能名Module],
     // ...
   })
   export class AppModule {}
   ```

## API エンドポイント

### Products

- `GET /products` - 商品一覧を取得
- `GET /products/:id` - 特定の商品を取得

### Health Check

- `GET /` - アプリケーションの起動確認

## 開発

### 必要な環境

- Node.js 20+
- pnpm 10.18.0

### セットアップ

```bash
# 依存関係のインストール（モノレポルートで実行）
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# プロダクション起動
pnpm start
```

### ポート

開発環境: `http://localhost:3001`

### CORS設定

開発環境では `http://localhost:3000` からのアクセスを許可しています。
本番環境では `src/main.ts` の CORS 設定を適切に変更してください。

## 技術スタック

- **フレームワーク**: NestJS 11.x
- **言語**: TypeScript 5.x
- **共有パッケージ**: @repo/contract (モノレポ内パッケージ)

## テスト

```bash
# ユニットテスト
pnpm test

# E2Eテスト
pnpm test:e2e

# テストカバレッジ
pnpm test:cov
```

## リンター/フォーマッター

```bash
# ESLint
pnpm lint

# Prettier
pnpm format
```
