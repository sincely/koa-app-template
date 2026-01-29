# koa2-start-basic

## 前言

使用Koa2实现了一个node.js后端服务器快速启动模板（即具备后端服务器的基本功能），使用了路由、数据库连接、请求体处理、异常处理、静态资源请求处理、session、登录拦截器等中间件，基本实现了一个node.js后端服务器的基本功能。并设计实现了用户模块的登录、注册、查找用户名接口。

之前基于Node.js(Koa) 实现了[vue-store](https://github.com/hai-27/vue-store)项目后端[store-server](https://github.com/hai-27/store-server)。昨晚我突然想到，可以从那个后端服务器把关键部分抽离出来实现一个后端服务器快速启动模板，需要使用的时候只需要分模块的添加一些接口并实现，就可以快速的构建起来一个后端服务器。

[接口文档](https://github.com/hai-27/koa2-start-basic/blob/master/docs/API.md)

## 运行项目

```
1. Project setup

npm install

2. Run project

npm run start

Windows 终端如果中文日志乱码：

npm run start:win
```


## Apifox 集成（不使用装饰器）

本项目采用 **OpenAPI(JSON) 自动生成** 的方式输出接口列表，然后在 Apifox 中导入/同步。

### 1) 安装依赖

```bash
npm i
```

### 2) 启动后访问文档

- OpenAPI JSON：`http://localhost:8080/openapi.json`
- Swagger UI：`http://localhost:8080/docs`

### 3) Apifox 导入/同步

在 Apifox 新建项目后：

- 导入方式 A（推荐）：选择 **导入数据** → **OpenAPI** → 填写 URL：`http://localhost:8080/openapi.json`
- 导入方式 B：访问 `http://localhost:8080/openapi.json` 保存为文件，再在 Apifox 选择 **OpenAPI 文件导入**

后续你只需要维护路由本身（`koa-router` 的 `get/post/...`），Apifox 重新导入/同步即可更新接口。

说明：自动生成可以稳定拿到 **path + method**；如果你希望 Apifox 里也自动出现“请求参数/响应结构/示例”，仍需要额外的元数据来源（例如统一的参数校验 schema、响应 schema，或单独的路由注册表）。

## Windows 终端日志中文乱码

这是典型的编码页不一致问题：Node 输出是 UTF-8，但 Windows 终端用默认代码页（常见是 CP936/GBK）去解读，中文就会变成“鏈嶅姟鍣ㄥ惎鍔ㄥ湪...”这种。

- 推荐：直接用 `npm run start:win`（会先执行 `chcp 65001` 切到 UTF-8 再启动服务）。
- 临时方案：在同一个终端先执行 `chcp 65001`，再执行 `npm run start`。
- VS Code 集成终端：确认文件编码为 UTF-8，并尽量使用 Windows Terminal/PowerShell，字体选支持中文的等宽字体（如 Consolas）。
