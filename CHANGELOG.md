# Changelog

All notable changes to this project will be documented in this file.


## [1.0.5](https://github.com/sincely/koa-app-template/compare/v1.0.4...v1.0.5) (2026-05-14)

### ✨ Features

* **admin:** 新增后台管理模块，包含用户、角色、菜单权限管理 ([7a1b38e](https://github.com/sincely/koa-app-template/commit/7a1b38e26648f94ef1ecd291fdb8eaec83ce5799))
* 添加会话支持并改进代码格式 ([18244ec](https://github.com/sincely/koa-app-template/commit/18244ec4fb089021411be2c97d65e817c6703c73))
* 添加部署脚本并优化构建流程 ([fcdb78e](https://github.com/sincely/koa-app-template/commit/fcdb78eb9d32a99d8a5c1c2305664502a5e763a5))

### 🐞 Bug Fixes

* 提升架构 ([e2ca1b1](https://github.com/sincely/koa-app-template/commit/e2ca1b1b910735c40c1dc87f91c78db58adcebd5))

### 📝 Documentation

* 为多个模块添加详细的JSDoc注释和代码说明 ([05d2a73](https://github.com/sincely/koa-app-template/commit/05d2a7314dfc0960c28c986ad9f0e357f2ad58da))
* 新增 MySQL 与后台管理相关指南文档 ([0146926](https://github.com/sincely/koa-app-template/commit/01469264eca8cd28c664008ef2c93c61f1d9ac8f))
* 更新架构文档中的技术栈版本与流程图 ([4bdc4d6](https://github.com/sincely/koa-app-template/commit/4bdc4d6fdce476aeacaaac6b632ffa9309451ff6))
* 添加 mock API 文档 ([03e88c6](https://github.com/sincely/koa-app-template/commit/03e88c607e21b0be3ad1d24dfd284ca46422f9ce))
* 添加PM2详细使用指南文档 ([3bd29a1](https://github.com/sincely/koa-app-template/commit/3bd29a108b8f27a28c844474cdc52079db3c27dc))
* 添加部署指南文档并调整构建脚本 ([460e03e](https://github.com/sincely/koa-app-template/commit/460e03ec28b5b00ffd4b559e4f21d96dec0779e9))

### 🔧 Chores

* 优化构建脚本与生产环境部署流程 ([1bc59ec](https://github.com/sincely/koa-app-template/commit/1bc59ec454feffc049e653281b876836cfe21ca0))
* 在 .prettierignore 中添加 pnpm-lock.yaml 文件 ([09a0223](https://github.com/sincely/koa-app-template/commit/09a0223bf5aaf34f406cd0b15630b761395b6906))
* 将内联 prepare 脚本提取到独立文件 ([80c7e93](https://github.com/sincely/koa-app-template/commit/80c7e93d123b7f5567ae1112f5a982c589dbde4c))
* 更新.gitignore并添加VSCode调试配置 ([46f3607](https://github.com/sincely/koa-app-template/commit/46f36070bc150e26d22e59461e2ae8960f98237e))
* 更新jsconfig.json以忽略过时警告 ([4bc36c7](https://github.com/sincely/koa-app-template/commit/4bc36c7f628cba30ab188dd5edc27c6a756ea384))
* 添加 swagger 相关依赖并优化 nodemon 配置 ([45aa97b](https://github.com/sincely/koa-app-template/commit/45aa97b927f0bcba7a34d0ce1a87100c11ba26b4))
* 清理依赖并更新文档 ([03ed827](https://github.com/sincely/koa-app-template/commit/03ed827dafd53fc126d3fb6306c554c556a7f269))
* 禁用详细日志并添加事件处理程序 ([8988f60](https://github.com/sincely/koa-app-template/commit/8988f602481e66cd5999f9792813fd6e24533f3d))
* 移除已弃用的TypeScript忽略警告配置 ([61ec9f7](https://github.com/sincely/koa-app-template/commit/61ec9f72d21e639bbee331c9f8bbdf08d3ad2a0c))
* 移除过时的技术指南文档 ([0beb178](https://github.com/sincely/koa-app-template/commit/0beb178d51764bfe528e00eaa2a44018a5bfa1a4))

### ♻️ Code Refactoring

* 将常量命名从大写蛇形改为小写驼峰 ([915c63a](https://github.com/sincely/koa-app-template/commit/915c63a6bfc7139943892f22e99f90f6705a7631))
* 调整服务层导入路径并新增路径映射 ([69bd892](https://github.com/sincely/koa-app-template/commit/69bd892017182ba6de81e1ef2f4f6c4077488320))
* 重构配置文件为模块化结构以提高可维护性 ([476afc9](https://github.com/sincely/koa-app-template/commit/476afc97ae7f503ecd195db2555a4e93eff75fca))

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
