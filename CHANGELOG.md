# Changelog

All notable changes to this project will be documented in this file.


## [1.0.4](https://github.com/sincely/koa-app-template/compare/v1.0.3...v1.0.4) (2026-04-02)

### ✨ Features

* 引入 Zod、Joi 和 Knex 文档，添加 Knex 调试日志，并新增密码迁移脚本 ([b681f5c](https://github.com/sincely/koa-app-template/commit/b681f5c79bc1a8ef03135453bbd3bdf014d77e7b))
* 添加基于 Bull 的后台任务队列和定时任务系统 ([28293d0](https://github.com/sincely/koa-app-template/commit/28293d0f1fa9652ee5ff2a6aea0c53e54e94da82))
* 移除 Knex 依赖，重构数据库操作为直接使用 MySQL 连接池，并新增多个数据访问模块 ([4abb9ff](https://github.com/sincely/koa-app-template/commit/4abb9ff4b75d040aa5f9d64818e2fd03b5caca23))

### 🔧 Chores

* 移除数据持久层文件中的注释信息 ([9dfb4f2](https://github.com/sincely/koa-app-template/commit/9dfb4f2f8410699c5b91283c34c5003887b8681b))

### ♻️ Code Refactoring

* 重构认证机制为纯 JWT Token，移除 session 依赖 ([9779b97](https://github.com/sincely/koa-app-template/commit/9779b97daf41739b5625462f30c262e7774fa35a))

## [1.0.3](https://github.com/sincely/koa-app-template/compare/v1.0.2...v1.0.3) (2026-02-01)

### ✨ Features

* 添加 Vercel 部署配置，更新服务器启动逻辑以支持无服务器环境 ([8d3ae3e](https://github.com/sincely/koa-app-template/commit/8d3ae3e4b78b84979e3c6755b389feadd62c3921))
* 添加文档服务配置，包括端口和目录设置 ([82d4016](https://github.com/sincely/koa-app-template/commit/82d4016500574f91b456f3efe4ee664a27b8c9e4))
* 移除环境变量中的 GITHUB_TOKEN 配置 ([cb31dbe](https://github.com/sincely/koa-app-template/commit/cb31dbe72a65606ee310597bb231a9d959986720))

## [1.0.2](https://github.com/sincely/koa-app-template/compare/v1.0.1...v1.0.2) (2026-01-31)

### ✨ Features

* 集成swagger-jsdoc并添加ShowDoc自动同步功能 ([8b9d75b](https://github.com/sincely/koa-app-template/commit/8b9d75bab0ed0bf6716e5d53796f67847c245abb))
* 添加 API 前缀配置并更新依赖项 ([ae384d9](https://github.com/sincely/koa-app-template/commit/ae384d9cfc466f0a5d31e9ef8b41b724d15667ed))
* 添加 OpenAPI 文档生成脚本及用户/订单控制器 ([be55c76](https://github.com/sincely/koa-app-template/commit/be55c76d061649110c08c2d25c4cf9f0e9343647))

### ♻️ Code Refactoring

* 修改用户控制器导出方式，统一使用小写命名；更新路由文件以匹配新导出 ([a5231a9](https://github.com/sincely/koa-app-template/commit/a5231a9eb3bea65e5d3cf6a5eb37ff04b986971a))

### 🤖 Continuous Integration

* 禁用由main/master分支推送触发的发布流程 ([34e852c](https://github.com/sincely/koa-app-template/commit/34e852c1cecbb0429ee4c276cb7b5ca8c04f762e))

## 1.0.1 (2026-01-29)

### 🎉 init

* 项目初始化 ([b65d269](https://github.com/sincely/koa-app-template/commit/b65d269aaa0ad2fda26ba0caad8633ea31bae6c8))
