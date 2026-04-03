#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f "package.json" ]; then
  echo "package.json not found in dist directory"
  exit 1
fi

if [ -f "package-lock.json" ]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

if [ -f "ecosystem.config.cjs" ]; then
  if pm2 describe koa-app-prod >/dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --only koa-app-prod --update-env
  else
    pm2 start ecosystem.config.cjs --only koa-app-prod
  fi

  if [ "${START_WORKER:-false}" = "true" ]; then
    if pm2 describe koa-worker-prod >/dev/null 2>&1; then
      pm2 restart ecosystem.config.cjs --only koa-worker-prod --update-env
    else
      pm2 start ecosystem.config.cjs --only koa-worker-prod
    fi
  fi
else
  if pm2 describe koa-app-prod >/dev/null 2>&1; then
    pm2 reload koa-app-prod --update-env
  else
    pm2 start app.js --name koa-app-prod
  fi
fi

pm2 save
pm2 status
