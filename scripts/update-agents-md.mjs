#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// JSONファイルを読み込むヘルパー関数
function readJSON(filepath) {
  try {
    return JSON.parse(readFileSync(filepath, 'utf-8'));
  } catch {
    return null;
  }
}

// YAMLファイルを読み込むヘルパー関数（簡易版）
function readYAML(filepath) {
  try {
    const content = readFileSync(filepath, 'utf-8');
    return content;
  } catch {
    return null;
  }
}

// ディレクトリの構造を取得
function getDirectoryStructure(dir, prefix = '', maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) return [];

  const items = [];
  try {
    const files = readdirSync(dir).sort();
    files.forEach((file, index) => {
      // 無視するディレクトリ/ファイル
      if (['node_modules', 'dist', '.next', '.turbo', '.git', 'coverage'].includes(file)) {
        return;
      }

      const filepath = join(dir, file);
      const stat = statSync(filepath);
      const isLast = index === files.length - 1;
      const connector = isLast ? '└── ' : '├── ';

      if (stat.isDirectory()) {
        items.push(`${prefix}${connector}${file}/`);
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        items.push(...getDirectoryStructure(filepath, newPrefix, maxDepth, currentDepth + 1));
      } else {
        items.push(`${prefix}${connector}${file}`);
      }
    });
  } catch (err) {
    // エラーは無視
  }

  return items;
}

// アプリケーション情報を取得
function getAppInfo(appPath, appName) {
  const packageJson = readJSON(join(appPath, 'package.json'));
  if (!packageJson) return null;

  const info = {
    name: appName,
    version: packageJson.version,
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    scripts: packageJson.scripts || {},
  };

  return info;
}

// AGENTS.mdの内容を生成
function generateAgentsMd() {
  const rootPackageJson = readJSON(join(rootDir, 'package.json'));
  const turboJson = readJSON(join(rootDir, 'turbo.json'));
  const workspaceYaml = readYAML(join(rootDir, 'pnpm-workspace.yaml'));

  // apps/ と packages/ の情報を収集
  const appsDir = join(rootDir, 'apps');
  const packagesDir = join(rootDir, 'packages');

  const apps = [];
  const packages = [];

  if (existsSync(appsDir)) {
    const appDirs = readdirSync(appsDir).filter(f =>
      statSync(join(appsDir, f)).isDirectory()
    );
    appDirs.forEach(appName => {
      const info = getAppInfo(join(appsDir, appName), appName);
      if (info) apps.push(info);
    });
  }

  if (existsSync(packagesDir)) {
    const pkgDirs = readdirSync(packagesDir).filter(f =>
      statSync(join(packagesDir, f)).isDirectory()
    );
    pkgDirs.forEach(pkgName => {
      const info = getAppInfo(join(packagesDir, pkgName), pkgName);
      if (info) packages.push(info);
    });
  }

  // 特定のアプリ情報を取得
  const apiInfo = apps.find(a => a.name === 'api');
  const frontendInfo = apps.find(a => a.name === 'frontend');
  const sharedInfo = packages.find(p => p.name === '@repo/shared');

  // AGENTS.mdの内容を生成
  let content = `# monorepo-nodejs リポジトリ構成

## 概要

このリポジトリは、pnpm と Turborepo を使用した Node.js モノレポ構成です。
NestJS バックエンド API と Next.js フロントエンド、共有パッケージで構成されています。

## 技術スタック

- **パッケージマネージャー**: ${rootPackageJson.packageManager || 'pnpm'}
- **ビルドシステム**: Turborepo ${rootPackageJson.devDependencies?.turbo?.replace('^', '') || ''}
- **言語**: TypeScript

## ディレクトリ構成

\`\`\`
monorepo-nodejs/
${getDirectoryStructure(rootDir, '', 2, 0).slice(0, 20).join('\n')}
\`\`\`

## アプリケーション詳細

### 1. apps/api (NestJS バックエンド)

**ポート**: 3001
**主な依存関係**:

${apiInfo ? Object.entries(apiInfo.dependencies)
  .filter(([key]) => key.startsWith('@nestjs') || key === '@repo/shared')
  .map(([key, value]) => `- ${key} (${value})`)
  .join('\n') : '- 情報なし'}

**実装されている機能**:

- \`/\` - アプリケーション基本エンドポイント (AppController)
- \`/products\` - 商品一覧取得 API (ProductsController)

**構成**:

\`\`\`
src/
${existsSync(join(appsDir, 'api/src'))
  ? getDirectoryStructure(join(appsDir, 'api/src'), '', 1, 0)
    .map(line => line.replace(/^/, ''))
    .join('\n')
  : ''}
\`\`\`

**スクリプト**:

${apiInfo ? Object.entries(apiInfo.scripts)
  .filter(([key]) => ['dev', 'build', 'test', 'start'].includes(key))
  .map(([key, value]) => `- \`pnpm ${key}\` - ${value}`)
  .join('\n') : ''}

### 2. apps/frontend (Next.js フロントエンド)

**ポート**: 3000
**主な依存関係**:

${frontendInfo ? Object.entries(frontendInfo.dependencies)
  .map(([key, value]) => `- ${key} (${value})`)
  .join('\n') : '- 情報なし'}

**実装されている機能**:

- 商品一覧表示ページ
- バックエンド API (\`http://localhost:3001/products\`) からデータ取得
- 型安全な API レスポンス処理

**構成**:

\`\`\`
app/
${existsSync(join(appsDir, 'frontend/app'))
  ? getDirectoryStructure(join(appsDir, 'frontend/app'), '', 1, 0)
    .map(line => line.replace(/^/, ''))
    .join('\n')
  : ''}
\`\`\`

**スクリプト**:

${frontendInfo ? Object.entries(frontendInfo.scripts)
  .filter(([key]) => ['dev', 'build', 'start', 'lint'].includes(key))
  .map(([key, value]) => `- \`pnpm ${key}\` - ${value}`)
  .join('\n') : ''}

### 3. packages/shared (共有パッケージ)

**パッケージ名**: ${sharedInfo ? sharedInfo.name : '@repo/shared'}
**役割**: アプリケーション間で共有する型定義・ユーティリティの提供

**エクスポートされる型・関数**:

\`\`\`typescript
// 共有パッケージから提供される型定義
// 詳細は packages/shared/src/index.ts を参照
\`\`\`

**ビルド出力**:

- \`dist/index.js\` - コンパイル済み JavaScript
- \`dist/index.d.ts\` - TypeScript 型定義ファイル

**スクリプト**:

${sharedInfo ? Object.entries(sharedInfo.scripts)
  .map(([key, value]) => `- \`pnpm ${key}\` - ${value}`)
  .join('\n') : ''}

## ワークスペース設定

### pnpm-workspace.yaml

\`\`\`yaml
${workspaceYaml || 'packages:\n  - "apps/*"\n  - "packages/*"'}
\`\`\`

### turbo.json

**タスク設定**:

${turboJson && turboJson.tasks ? Object.entries(turboJson.tasks)
  .map(([task, config]) => {
    const details = [];
    if (config.cache === false) details.push('キャッシュ無効');
    if (config.persistent) details.push('永続的タスク');
    if (config.outputs) details.push(`出力先: ${config.outputs.join(', ')}`);
    return `- \`${task}\`: ${details.join('、')}`;
  })
  .join('\n') : ''}

## 主要スクリプト（ルートレベル）

\`\`\`bash
${rootPackageJson.scripts ? Object.entries(rootPackageJson.scripts)
  .map(([key, value]) => `pnpm ${key}      # ${value}`)
  .join('\n') : ''}
\`\`\`

Turborepo により、依存関係を考慮した並列実行が行われます。

## アプリケーション間の連携

1. **型の共有**:

   - \`packages/shared\` で定義された型を、\`api\` と \`frontend\` の両方で利用
   - 例: \`Product\`, \`GetProductsResponse\` インターフェース

2. **API 通信**:

   - フロントエンド → バックエンド: \`http://localhost:3001/products\`
   - バックエンドは CORS を有効化して \`http://localhost:3000\` からのアクセスを許可

3. **開発フロー**:
   - \`packages/shared\` の変更は自動的に \`api\` と \`frontend\` に反映される（watch モード利用時）
   - 型安全性により、API の変更がフロントエンドに即座に伝播

## セットアップ方法

\`\`\`bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動（全アプリケーション）
pnpm dev

# または個別起動
cd apps/api && pnpm dev
cd apps/frontend && pnpm dev
cd packages/shared && pnpm dev
\`\`\`

## 注意事項

- バックエンド API は開発環境でポート 3001 で起動します
- フロントエンドは開発環境でポート 3000 で起動します
- 共有パッケージを変更した場合は、ビルドまたは watch モードが必要です
- CORS 設定は開発環境用のため、本番環境では適切に設定する必要があります

---

*このファイルは pre-commit フックにより自動生成されます*
`;

  return content;
}

// メイン処理
try {
  const content = generateAgentsMd();
  const outputPath = join(rootDir, 'AGENTS.md');
  writeFileSync(outputPath, content, 'utf-8');
  console.log('✓ AGENTS.md を更新しました');
} catch (error) {
  console.error('✗ AGENTS.md の更新に失敗しました:', error.message);
  process.exit(1);
}





