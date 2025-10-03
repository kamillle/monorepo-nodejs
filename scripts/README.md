# Scripts

## update-agents-md.mjs

リポジトリの現在の構成状態を自動的に `AGENTS.md` に反映するスクリプトです。

### 機能

- `package.json` ファイルから依存関係情報を収集
- ディレクトリ構造を自動生成
- `turbo.json` と `pnpm-workspace.yaml` の設定を読み込み
- 各アプリケーションのスクリプト情報を抽出

### 使用方法

```bash
# 手動実行
node scripts/update-agents-md.mjs

# pre-commit フックで自動実行される
git commit -m "メッセージ"
```

### Pre-commit フック

このスクリプトは pre-commit フック（`.husky/pre-commit`）により、すべてのコミット時に自動的に実行されます。

**動作フロー**:

1. コミット時に自動実行
2. リポジトリの構成を解析
3. `AGENTS.md` を更新
4. 更新された `AGENTS.md` をコミットに含める

### カスタマイズ

スクリプトを編集することで、以下をカスタマイズできます：

- ディレクトリ構造の深さ（デフォルト: 2 階層）
- 除外するディレクトリ（デフォルト: `node_modules`, `dist`, `.next`, `.turbo`, `.git`, `coverage`）
- `AGENTS.md` に含める情報の種類

### トラブルシューティング

**問題**: pre-commit フックが実行されない

**解決策**:

```bash
# フックに実行権限を付与
chmod +x .husky/pre-commit

# husky を再初期化
pnpm exec husky init
```

**問題**: スクリプトがエラーで失敗する

**解決策**:

- Node.js のバージョンを確認（ES Modules 対応バージョンが必要）
- `package.json` の存在を確認
- エラーメッセージを確認して該当箇所を修正
