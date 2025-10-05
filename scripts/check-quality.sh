#!/bin/bash

# Quality check script - runs the same checks as GitHub Actions
# Usage: ./scripts/check-quality.sh

set -e

echo "🔍 Running quality checks..."

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔧 TypeScript type checking..."
npx tsc --noEmit

echo "🧹 ESLint check..."
pnpm lint

echo "💅 Prettier format check..."
pnpm format:check

echo "🧪 Running tests..."
pnpm test:run

echo "🏗️ Building project..."
pnpm build

echo "📊 Checking for unused dependencies..."
npx depcheck --json > unused-deps.json || true
if [ -s unused-deps.json ]; then
  echo "❌ Found unused dependencies:"
  cat unused-deps.json
  echo "Please remove them or add them to package.json if needed."
  exit 1
fi

echo "📈 Checking for unused exports..."
npx ts-unused-exports tsconfig.json --excludePathsFromReport=node_modules,coverage,.next,dist,build || true

echo "🔒 Security audit..."
pnpm audit --audit-level moderate

echo "✅ All quality checks passed!"
