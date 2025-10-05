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


echo "🔒 Security audit..."
pnpm audit --audit-level moderate

echo "✅ All quality checks passed!"
