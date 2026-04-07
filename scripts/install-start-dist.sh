#!/usr/bin/env bash
# 使用严格模式：
# -e: 任意命令失败即退出
# -u: 使用未定义变量时报错
# -o pipefail: 管道中任一命令失败则整体失败
set -euo pipefail

# 切换到脚本所在目录，避免从其他目录执行时相对路径失效
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 基础校验：dist 目录必须包含 package.json（用于安装依赖）
if [ ! -f "package.json" ]; then
  echo "package.json not found in dist directory"
  exit 1
fi

# PM2 日志目录预创建，避免首次启动提示 logs 目录不存在
mkdir -p logs

# 优先使用 npm ci（可复现安装，速度更快）
# 若 lock 文件不存在，则降级到 npm install
if [ -f "package-lock.json" ]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi

# 如果服务器未安装 pm2，则自动全局安装
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

# 优先使用 ecosystem 配置启动（支持多应用/多进程配置）
if [ -f "ecosystem.config.cjs" ]; then
  # 主应用已存在则热重载，不存在则首次启动
  if pm2 describe koa-app-prod >/dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --only koa-app-prod --update-env
  else
    pm2 start ecosystem.config.cjs --only koa-app-prod
  fi

  # 可选启动 worker：通过 START_WORKER=true 控制
  # 已存在 worker 则重启，不存在则首次启动
  if [ "${START_WORKER:-false}" = "true" ]; then
    if pm2 describe koa-worker-prod >/dev/null 2>&1; then
      pm2 restart ecosystem.config.cjs --only koa-worker-prod --update-env
    else
      pm2 start ecosystem.config.cjs --only koa-worker-prod
    fi
  fi
else
  # 无 ecosystem 配置时回退到单进程 app.js 启动方式
  if pm2 describe koa-app-prod >/dev/null 2>&1; then
    pm2 reload koa-app-prod --update-env
  else
    pm2 start app.js --name koa-app-prod
  fi
fi

# 保存当前 PM2 进程列表，便于机器重启后恢复
pm2 save
# 输出当前进程状态，便于发布后立即确认
pm2 status
