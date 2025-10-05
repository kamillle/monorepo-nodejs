FROM node:20-alpine

# pnpm のインストール
RUN corepack enable && corepack prepare pnpm@10.18.0 --activate

WORKDIR /app

# pnpm-workspace.yaml と package.json をコピー
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# 各パッケージの package.json をコピー
COPY apps/api/package.json ./apps/api/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/contract/package.json ./packages/contract/

# 依存関係のインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# contract パッケージをビルド
RUN pnpm --filter @repo/contract build

EXPOSE 3001

# デフォルトコマンド（docker-compose で上書き可能）
CMD ["pnpm", "--filter", "api", "dev"]

