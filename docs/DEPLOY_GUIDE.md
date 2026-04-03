# 部署文档（dist 发布包）

本文档说明如何将本项目以 `dist` 产物方式部署到 Linux 服务器，包含首次部署、更新发布、回滚与常见问题排查。

## 1. 部署方式概览

本项目推荐采用以下流程：

1. 本地构建 `dist`
2. 上传 `dist` 到服务器
3. 在服务器进入 `dist` 执行安装启动脚本
4. 由 PM2 托管服务进程

构建后 `dist` 会自动包含：

- `app.js`、`worker.js` 与所有运行时代码
- `package.json`、`package-lock.json`
- `ecosystem.config.cjs`（已自动调整为 `dist` 目录可直接运行）
- `install-start.sh`（安装并启动脚本）

## 2. 环境要求

- Linux 服务器（Ubuntu/CentOS 均可）
- Node.js 18+（建议 20+）
- npm（随 Node 安装）
- 可访问数据库/Redis（按 `.env.production` 配置）

说明：`install-start.sh` 会自动检查并安装 PM2（若未安装）。

## 3. 本地打包

在项目根目录执行：

```bash
npm install
npm run build
```

构建产物目录：

- `dist/`

## 4. 服务器首次部署

### 4.1 上传目录

将本地 `dist` 上传到服务器目标路径，例如：

- `/var/www/koa-app-template/dist`

### 4.2 放置环境变量

在 `dist` 目录下放置生产环境变量文件（推荐）：

- `.env.production`

至少包含：

- `PORT`
- `DB_HOST` `DB_USER` `DB_PASSWORD` `DB_NAME`
- `REDIS_HOST` `REDIS_PORT` `REDIS_PASSWORD` `REDIS_DB`
- `JWT_SECRET` `JWT_EXPIRES_IN`

### 4.3 安装并启动

```bash
cd /var/www/koa-app-template/dist
chmod +x install-start.sh
./install-start.sh
```

如果需要同时启动 Worker：

```bash
START_WORKER=true ./install-start.sh
```

脚本会执行：

- 安装生产依赖（优先 `npm ci --omit=dev`）
- 安装 PM2（缺失时）
- 启动/重载 `koa-app-prod`
- 按需启动/重启 `koa-worker-prod`
- 执行 `pm2 save`

## 5. 更新发布流程

### 5.1 本地重新构建

```bash
npm run build
```

### 5.2 上传新 dist（覆盖服务器旧目录）

建议先备份旧版本再覆盖。

### 5.3 服务器执行发布

```bash
cd /var/www/koa-app-template/dist
./install-start.sh
```

若发布包含 Worker 改动：

```bash
cd /var/www/koa-app-template/dist
START_WORKER=true ./install-start.sh
```

## 6. PM2 常用命令

```bash
pm2 status
pm2 logs koa-app-prod --lines 200
pm2 logs koa-worker-prod --lines 200
pm2 restart koa-app-prod
pm2 reload koa-app-prod
pm2 stop koa-app-prod
pm2 delete koa-app-prod
pm2 save
```

## 7. Nginx 反向代理示例

如果应用监听 `3000`，可通过 Nginx 暴露 80/443：

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

修改后执行：

```bash
nginx -t
sudo systemctl reload nginx
```

## 8. 回滚方案

推荐每次发布前将旧目录备份，例如：

- `/var/www/koa-app-template/releases/2026-04-03-1200`

回滚步骤：

1. 将当前 `dist` 切换到上一个稳定版本
2. 执行 `./install-start.sh`
3. 检查 `pm2 status` 与日志确认恢复

## 9. 常见问题排查

### 9.1 启动报 `EADDRINUSE`

端口被占用。处理：

```bash
pm2 status
lsof -i :3000
```

释放冲突进程后重试启动。

### 9.2 应用启动后连不上数据库

检查：

- `dist/.env.production` 是否存在且变量名正确
- 数据库白名单/安全组是否放行
- 账号密码是否正确

### 9.3 PM2 重启后服务未恢复

执行：

```bash
pm2 save
pm2 startup
```

并按输出提示执行一次系统级命令。

### 9.4 `install-start.sh` 权限不足

执行：

```bash
chmod +x install-start.sh
```

## 10. 快速命令清单

首次部署：

```bash
cd /var/www/koa-app-template/dist
chmod +x install-start.sh
./install-start.sh
```

更新发布：

```bash
cd /var/www/koa-app-template/dist
./install-start.sh
```

更新并重启 Worker：

```bash
cd /var/www/koa-app-template/dist
START_WORKER=true ./install-start.sh
```
