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

- [后台认证](#后台认证)
  - [POST 后台注册](#📝-post-后台注册)
  - [POST 后台登录](#📝-post-后台登录)
  - [GET 获取当前用户信息](#�-get-获取当前用户信息)
  - [GET 获取当前用户菜单](#�-get-获取当前用户菜单)
  - [GET 获取当前用户权限](#�-get-获取当前用户权限)
  - [POST 后台退出登录](#📝-post-后台退出登录)
- [菜单管理](#菜单管理)
  - [GET 获取菜单列表](#�-get-获取菜单列表)
  - [POST 创建菜单](#📝-post-创建菜单)
  - [PUT 更新菜单](#🔄-put-更新菜单)
  - [DELETE 删除菜单](#🗑️-delete-删除菜单)
- [角色管理](#角色管理)
  - [GET 获取角色列表](#�-get-获取角色列表)
  - [POST 创建角色](#📝-post-创建角色)
  - [PUT 更新角色](#🔄-put-更新角色)
  - [DELETE 删除角色](#🗑️-delete-删除角色)
- [用户管理](#用户管理)
  - [GET 获取用户列表](#�-get-获取用户列表)
  - [POST 创建用户](#📝-post-创建用户)
  - [PUT 更新用户](#🔄-put-更新用户)
  - [DELETE 删除用户](#🗑️-delete-删除用户)
- [用户模块](#用户模块)
  - [POST 用户登录](#📝-post-用户登录)
  - [POST 查询用户名是否存在](#📝-post-查询用户名是否存在)
  - [POST 用户注册](#📝-post-用户注册)

### 后台认证

后台认证相关接口

#### 📝 POST 后台注册

`POST /api/admin/auth/register`

**描述**: 注册后台账号并绑定默认角色，不包含验证码校验

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `username` | string | ✅ | 登录用户名 | `testuser` |
| `password` | string | ✅ | 登录密码 | `Test123456` |
| `confirmPassword` | string | ✅ | 确认密码 | `Test123456` |
| `email` | string | ✅ | 邮箱地址 | `test@example.com` |

**请求示例**:

```json
{
  "username": "testuser",
  "password": "Test123456",
  "confirmPassword": "Test123456",
  "email": "test@example.com"
}
```

##### 响应

**200** - 注册成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 📝 POST 后台登录

`POST /api/admin/auth/login`

**描述**: 使用用户名和密码登录后台，返回 token、用户信息、菜单和权限数据

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `username` | string | ✅ | 登录用户名 | `testuser` |
| `password` | string | ✅ | 登录密码 | `Test123456` |

**请求示例**:

```json
{
  "username": "testuser",
  "password": "Test123456"
}
```

##### 响应

**200** - 登录成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### � GET 获取当前用户信息

`GET /api/admin/auth/profile`

**描述**: 获取当前登录后台用户的基础资料

##### 响应

**200** - 获取成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### � GET 获取当前用户菜单

`GET /api/admin/auth/menus`

**描述**: 获取当前登录后台用户可访问的菜单树

##### 响应

**200** - 获取成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### � GET 获取当前用户权限

`GET /api/admin/auth/permissions`

**描述**: 获取当前登录后台用户的菜单、按钮和权限码

##### 响应

**200** - 获取成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 📝 POST 后台退出登录

`POST /api/admin/auth/logout`

**描述**: 退出当前后台登录会话

##### 响应

**200** - 退出成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

### 菜单管理

菜单管理相关接口

#### � GET 获取菜单列表

`GET /api/admin/system/menus`

**描述**: 获取菜单平铺列表和树形结构

##### 响应

**200** - 获取成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 📝 POST 创建菜单

`POST /api/admin/system/menus`

**描述**: 创建新的后台菜单节点

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `path` | string | ✅ | 菜单访问路径 | `` |
| `name` | string | ✅ | 菜单名称 | `testuser` |
| `component` | string | ✅ | 前端组件路径 | `` |
| `redirect` | string | ✅ | 重定向路径 | `` |
| `meta` | object | ✅ | 菜单元信息 | `[object Object]` |
| `parentId` | number | ✅ | 父级菜单 ID | `1` |

**请求示例**:

```json
{
  "path": "",
  "name": "testuser",
  "component": "",
  "redirect": "",
  "meta": {},
  "parentId": 1
}
```

##### 响应

**200** - 创建成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 🔄 PUT 更新菜单

`PUT /api/admin/system/menus`

**描述**: 更新后台菜单节点信息

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `id` | number | ✅ | 菜单 ID | `1` |
| `path` | string | ✅ | 菜单访问路径 | `` |
| `name` | string | ✅ | 菜单名称 | `testuser` |
| `component` | string | ✅ | 前端组件路径 | `` |
| `redirect` | string | ✅ | 重定向路径 | `` |
| `meta` | object | ✅ | 菜单元信息 | `[object Object]` |
| `parentId` | number | ✅ | 父级菜单 ID | `1` |

**请求示例**:

```json
{
  "id": 1,
  "path": "",
  "name": "testuser",
  "component": "",
  "redirect": "",
  "meta": {},
  "parentId": 1
}
```

##### 响应

**200** - 更新成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 🗑️ DELETE 删除菜单

`DELETE /api/admin/system/menus`

**描述**: 删除指定菜单节点

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `id` | number | ✅ | 菜单 ID | `1` |

**请求示例**:

```json
{
  "id": 1
}
```

##### 响应

**200** - 删除成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

### 角色管理

角色管理相关接口

#### � GET 获取角色列表

`GET /api/admin/system/roles`

**描述**: 获取角色列表、绑定的菜单 ID 以及菜单选项

##### 响应

**200** - 获取成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 📝 POST 创建角色

`POST /api/admin/system/roles`

**描述**: 创建新角色并绑定菜单权限

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `roleName` | string | ✅ | 角色名称 | `testuser` |
| `description` | string | ✅ | 角色描述 | `` |
| `routeIds` | array | ✅ | 关联菜单 ID 列表 | `` |

**请求示例**:

```json
{
  "roleName": "testuser",
  "description": "",
  "routeIds": []
}
```

##### 响应

**200** - 创建成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 🔄 PUT 更新角色

`PUT /api/admin/system/roles`

**描述**: 更新角色信息并重置角色菜单权限

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `roleId` | number | ✅ | 角色 ID | `1` |
| `roleName` | string | ✅ | 角色名称 | `testuser` |
| `description` | string | ✅ | 角色描述 | `` |
| `routeIds` | array | ✅ | 关联菜单 ID 列表 | `` |

**请求示例**:

```json
{
  "roleId": 1,
  "roleName": "testuser",
  "description": "",
  "routeIds": []
}
```

##### 响应

**200** - 更新成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 🗑️ DELETE 删除角色

`DELETE /api/admin/system/roles`

**描述**: 删除角色及其菜单权限绑定

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `roleId` | number | ✅ | 角色 ID | `1` |

**请求示例**:

```json
{
  "roleId": 1
}
```

##### 响应

**200** - 删除成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

### 用户管理

用户管理相关接口

#### � GET 获取用户列表

`GET /api/admin/system/users`

**描述**: 分页获取后台用户列表，并返回角色选项

##### 请求参数 (Query)

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `page` | number | ✅ | 当前页码 | `1` |
| `pageSize` | number | ✅ | 每页数量 | `1` |
| `keyword` | string | ✅ | 用户名或邮箱关键词 | `` |
| `status` | string | ✅ | 用户状态 | `` |
| `roleId` | number | ✅ | 角色 ID | `1` |

##### 响应

**200** - 获取成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 📝 POST 创建用户

`POST /api/admin/system/users`

**描述**: 新增后台用户并绑定角色

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `username` | string | ✅ | 用户名 | `testuser` |
| `password` | string | ✅ | 登录密码 | `Test123456` |
| `gender` | string | ✅ | 性别 | `` |
| `age` | number | ✅ | 年龄 | `0` |
| `idCard` | string | ✅ | 身份证号 | `1` |
| `email` | string | ✅ | 邮箱地址 | `test@example.com` |
| `address` | string | ✅ | 联系地址 | `` |
| `status` | string | ✅ | 用户状态 | `` |
| `avatar` | string | ✅ | 头像地址 | `` |
| `roleId` | number | ✅ | 角色 ID | `1` |

**请求示例**:

```json
{
  "username": "testuser",
  "password": "Test123456",
  "gender": "",
  "age": 0,
  "idCard": "1",
  "email": "test@example.com",
  "address": "",
  "status": "",
  "avatar": "",
  "roleId": 1
}
```

##### 响应

**200** - 创建成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 🔄 PUT 更新用户

`PUT /api/admin/system/users`

**描述**: 更新后台用户资料、角色或密码

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `id` | number | ✅ | 用户 ID | `1` |
| `password` | string | ✅ | 新密码 | `Test123456` |
| `gender` | string | ✅ | 性别 | `` |
| `age` | number | ✅ | 年龄 | `0` |
| `idCard` | string | ✅ | 身份证号 | `1` |
| `email` | string | ✅ | 邮箱地址 | `test@example.com` |
| `address` | string | ✅ | 联系地址 | `` |
| `status` | string | ✅ | 用户状态 | `` |
| `avatar` | string | ✅ | 头像地址 | `` |
| `roleId` | number | ✅ | 角色 ID | `1` |

**请求示例**:

```json
{
  "id": 1,
  "password": "Test123456",
  "gender": "",
  "age": 0,
  "idCard": "1",
  "email": "test@example.com",
  "address": "",
  "status": "",
  "avatar": "",
  "roleId": 1
}
```

##### 响应

**200** - 更新成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

#### 🗑️ DELETE 删除用户

`DELETE /api/admin/system/users`

**描述**: 删除指定后台用户

##### 请求参数 (Body)

**Content-Type**: `application/json`

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| `id` | number | ✅ | 用户 ID | `1` |

**请求示例**:

```json
{
  "id": 1
}
```

##### 响应

**200** - 删除成功

```json
{
  "code": 0,
  "msg": "",
  "data": {}
}
```

---

### 用户模块

用户模块相关接口

#### 📝 POST 用户登录

`POST /api/user/login`

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

`POST /api/user/findUserName`

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

`POST /api/user/register`

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
