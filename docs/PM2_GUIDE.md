# PM2 详细使用文档（koa-app-template）

本文档基于当前项目的 `ecosystem.config.cjs`，给出从安装、启动、发布、日志、排错到常见命令的完整操作清单。

## 1. PM2 是什么

PM2 是 Node.js 进程管理器，主要能力：

- 守护进程：进程异常退出后自动拉起
- 多实例：支持 `cluster` 模式充分利用多核 CPU
- 零停机重载：`reload` 时不中断服务
- 日志管理：按应用聚合查看、可配置输出文件
- 开机自启：服务器重启后自动恢复进程

## 2. 本项目 PM2 配置说明

配置文件：`ecosystem.config.cjs`

当前定义了 4 个应用：

- `koa-app-test`：测试环境 API 服务（`./dist/app.js`，cluster 模式，端口 3001）
- `koa-app-prod`：生产环境 API 服务（`./dist/app.js`，cluster 模式，端口 3000）
- `koa-worker-test`：测试环境 Worker（`./src/worker.js`，fork 模式）
- `koa-worker-prod`：生产环境 Worker（`./src/worker.js`，fork 模式）

关键字段解释：

- `instances: 'max'`：API 按 CPU 核心数启动多实例
- `exec_mode: 'cluster'`：API 使用集群模式，支持平滑重启
- `exec_mode: 'fork'`：Worker 单进程模式，避免重复消费任务
- `max_memory_restart: '1G'`：进程内存超过 1G 自动重启
- `error_file/out_file`：错误日志与标准输出日志文件路径
- `merge_logs: true`：多实例日志合并
- `env`：按应用注入环境变量（如 `NODE_ENV`、`PORT`）

## 3. 安装与准备

### 3.1 全局安装 PM2

```bash
npm i -g pm2
pm2 -v
```

### 3.2 项目构建（API 服务）

本项目 API 在 PM2 下运行 `dist/app.js`，启动前需要先构建：

```bash
npm i
npm run build
```

## 4. 启动方式

### 4.1 启动整个生态配置

```bash
pm2 start ecosystem.config.cjs
```

### 4.2 仅启动指定应用

```bash
pm2 start ecosystem.config.cjs --only koa-app-test
pm2 start ecosystem.config.cjs --only koa-app-prod
pm2 start ecosystem.config.cjs --only koa-worker-test
pm2 start ecosystem.config.cjs --only koa-worker-prod
```

### 4.3 查看运行状态

```bash
pm2 list
pm2 status
pm2 show koa-app-prod
```

## 5. 发布与更新流程（推荐）

### 5.1 测试环境发布

```bash
npm run build:test
pm2 reload ecosystem.config.cjs --only koa-app-test
pm2 restart ecosystem.config.cjs --only koa-worker-test
```

### 5.2 生产环境发布

```bash
npm run build:prod
pm2 reload ecosystem.config.cjs --only koa-app-prod
pm2 restart ecosystem.config.cjs --only koa-worker-prod
```

说明：

- API 服务优先使用 `reload`（平滑重载，尽量无中断）
- Worker 通常使用 `restart`（确保新代码完整生效）

## 6. 日志管理

### 6.1 实时查看日志

```bash
pm2 logs
pm2 logs koa-app-prod
pm2 logs koa-worker-prod --lines 200
```

### 6.2 日志文件位置（由配置决定）

- API 错误日志：`./logs/app-err.log`
- API 输出日志：`./logs/app-out.log`
- Worker 错误日志：`./logs/worker-err.log`
- Worker 输出日志：`./logs/worker-out.log`

### 6.3 清空日志

```bash
pm2 flush
```

## 7. 常用运维命令

```bash
pm2 stop koa-app-prod
pm2 restart koa-app-prod
pm2 reload koa-app-prod
pm2 delete koa-app-prod
pm2 monit
pm2 ping
```

## 8. 开机自启（生产环境建议开启）

### 8.1 生成启动脚本

```bash
pm2 startup
```

按命令输出提示执行一次带 `sudo` 的命令。

### 8.2 保存当前进程快照

```bash
pm2 save
```

说明：服务器重启后 PM2 会按快照恢复进程。

## 9. 常见问题与排查

### 9.1 端口占用（EADDRINUSE）

现象：应用启动失败并提示端口已被占用。  
处理：

1. 检查被占用端口对应进程
2. 停掉旧进程后再 `pm2 restart/reload`

### 9.2 修改了配置但未生效

执行：

```bash
pm2 reload ecosystem.config.cjs --update-env
```

如果仍不生效，可执行：

```bash
pm2 delete <app-name>
pm2 start ecosystem.config.cjs --only <app-name>
```

### 9.3 构建后代码没更新

确认流程顺序：

1. `npm run build`
2. `pm2 reload ecosystem.config.cjs --only koa-app-prod`

若跳过构建，`dist` 中仍是旧代码。

### 9.4 Worker 重复消费任务

检查 Worker 是否被误设多实例。  
本项目建议保持：

- `instances: 1`
- `exec_mode: 'fork'`

## 10. 一套可直接执行的最小上线命令

```bash
npm i
npm run build:prod
pm2 start ecosystem.config.cjs --only koa-app-prod
pm2 start ecosystem.config.cjs --only koa-worker-prod
pm2 save
```

后续更新：

```bash
npm run build:prod
pm2 reload ecosystem.config.cjs --only koa-app-prod
pm2 restart ecosystem.config.cjs --only koa-worker-prod
pm2 save
```

