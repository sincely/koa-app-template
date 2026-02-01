# Koa App Template API

> Koa 应用模板接口文档 - 基于 Koa.js 框架构建的 RESTful API 服务

**版本**: 1.0.0

## 🌐 服务器环境

| 环境 | 地址 |
| --- | --- |
| 开发环境 | `http://localhost:8080` |
| 测试环境 | `http://test.api.example.com` |
| 生产环境 | `http://api.example.com` |

## 📑 目录

- [用户模块](#用户模块)
  - [POST 用户登录](#📝-post-用户登录)
  - [POST 查询用户名是否存在](#📝-post-查询用户名是否存在)
  - [POST 用户注册](#📝-post-用户注册)

### 用户模块

用户模块相关接口

#### 📝 POST 用户登录

`POST /user/login`

**描述**: 验证用户名和密码，登录成功后将用户信息保存到 session

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `userName` | string | ✅ | 用户名（以字母开头，允许5-16字节，允许字母数字下划线） | `testuser` |
| `password` | string | ✅ | 密码（以字母开头，长度在6~18之间，只能包含字母、数字和下划线） | `Test123456` |

**请求示例**:

```json
{
  "userName": "testuser",
  "password": "Test123456"
}
```

##### 响应

**200** - 登录成功返回用户信息

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 📝 POST 查询用户名是否存在

`POST /user/findUserName`

**描述**: 查询数据库中是否已存在指定用户名，用于注册前的前端校验

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `userName` | string | ✅ | 要查询的用户名 | `testuser` |

**请求示例**:

```json
{
  "userName": "testuser"
}
```

##### 响应

**200** - 查询结果

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 📝 POST 用户注册

`POST /user/register`

**描述**: 注册新用户，会先检查用户名是否已存在，不存在则创建新用户

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `userName` | string | ✅ | 用户名（以字母开头，允许5-16字节，允许字母数字下划线） | `testuser` |
| `password` | string | ✅ | 密码（以字母开头，长度在6~18之间，只能包含字母、数字和下划线） | `Test123456` |

**请求示例**:

```json
{
  "userName": "testuser",
  "password": "Test123456"
}
```

##### 响应

**200** - 注册结果

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

---

## 📧 联系方式

- **联系人**: koa-api
- **邮箱**: 1738248438@qq.com
- **网站**: https://github.com/your-repo/koa-app-template

## 📄 许可证

本项目采用 [MIT](https://opensource.org/licenses/MIT) 许可证
