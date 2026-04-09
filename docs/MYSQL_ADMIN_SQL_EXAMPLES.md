# MySQL 后台管理实战 SQL 例子

这份文档专门面向后台管理开发，目标不是讲语法定义，而是直接给出可以参考和改造的 SQL 模板。

示例主要围绕当前项目中已经存在的表：

- `Users`
- `Roles`
- `RouteAuth`
- `RoleRoute`
- `ButtonAuth`

---

## 1. 后台管理常见场景

后台管理里最常见的数据库需求通常是：

- 用户列表分页
- 用户搜索与筛选
- 用户新增、编辑、删除
- 角色列表与角色下用户数量
- 角色绑定菜单权限
- 菜单列表、菜单树、父子菜单查询
- 按角色查询菜单与按钮权限

---

## 2. 用户管理 SQL

### 2.1 查询用户分页列表

```sql
SELECT
  u.id,
  u.username,
  u.gender,
  u.age,
  u.idCard,
  u.email,
  u.address,
  u.createTime,
  u.status,
  u.avatar,
  u.roleId,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
ORDER BY u.id DESC
LIMIT 0, 10;
```

适用场景：

- 用户管理页列表
- 后台首页最近用户

---

### 2.2 查询用户总数

```sql
SELECT COUNT(*) AS total
FROM Users;
```

通常分页接口会写两条 SQL：

- 一条查列表
- 一条查总数

---

### 2.3 按用户名或邮箱搜索

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.username LIKE '%admin%'
   OR u.email LIKE '%admin%'
ORDER BY u.id DESC
LIMIT 0, 10;
```

对应总数：

```sql
SELECT COUNT(*) AS total
FROM Users u
WHERE u.username LIKE '%admin%'
   OR u.email LIKE '%admin%';
```

---

### 2.4 按状态筛选用户

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.status = 'active'
ORDER BY u.id DESC
LIMIT 0, 10;
```

---

### 2.5 按角色筛选用户

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.roleId = 1
ORDER BY u.id DESC;
```

---

### 2.6 组合筛选

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE (u.username LIKE '%tom%' OR u.email LIKE '%tom%')
  AND u.status = 'active'
  AND u.roleId = 2
ORDER BY u.id DESC
LIMIT 0, 10;
```

---

### 2.7 查询单个用户详情

```sql
SELECT
  u.id,
  u.username,
  u.gender,
  u.age,
  u.idCard,
  u.email,
  u.address,
  u.createTime,
  u.status,
  u.avatar,
  u.roleId,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.id = 1
LIMIT 1;
```

---

### 2.8 检查用户名是否重复

```sql
SELECT id, username
FROM Users
WHERE username = 'admin'
LIMIT 1;
```

---

### 2.9 检查邮箱是否重复

```sql
SELECT id, email
FROM Users
WHERE email = 'admin@example.com'
LIMIT 1;
```

---

### 2.10 新增用户

```sql
INSERT INTO Users (
  username,
  gender,
  age,
  idCard,
  email,
  address,
  status,
  avatar,
  roleId,
  password
)
VALUES (
  'new_admin',
  'other',
  25,
  '110101199901011234',
  'new_admin@example.com',
  '上海市浦东新区',
  'active',
  '/avatars/default.png',
  1,
  '$2b$10$hashedPassword'
);
```

---

### 2.11 更新用户资料

```sql
UPDATE Users
SET
  email = 'admin2@example.com',
  address = '北京市海淀区',
  status = 'active',
  roleId = 2
WHERE id = 1;
```

---

### 2.12 更新用户密码

```sql
UPDATE Users
SET password = '$2b$10$newHashedPassword'
WHERE id = 1;
```

---

### 2.13 删除用户

```sql
DELETE FROM Users
WHERE id = 10;
```

后台开发里建议先查再删：

```sql
SELECT id, username FROM Users WHERE id = 10;
DELETE FROM Users WHERE id = 10;
```

---

## 3. 角色管理 SQL

### 3.1 查询角色列表

```sql
SELECT
  r.roleId,
  r.roleName,
  r.description
FROM Roles r
ORDER BY r.roleId ASC;
```

---

### 3.2 查询角色及用户数量

```sql
SELECT
  r.roleId,
  r.roleName,
  r.description,
  COUNT(u.id) AS userCount
FROM Roles r
LEFT JOIN Users u ON u.roleId = r.roleId
GROUP BY r.roleId, r.roleName, r.description
ORDER BY r.roleId ASC;
```

---

### 3.3 检查角色名是否重复

```sql
SELECT roleId, roleName
FROM Roles
WHERE roleName = 'admin'
LIMIT 1;
```

---

### 3.4 新增角色

```sql
INSERT INTO Roles (roleName, description)
VALUES ('editor', '内容编辑角色');
```

---

### 3.5 更新角色信息

```sql
UPDATE Roles
SET
  roleName = 'auditor',
  description = '审核角色'
WHERE roleId = 3;
```

---

### 3.6 删除角色前检查是否还有用户绑定

```sql
SELECT COUNT(*) AS total
FROM Users
WHERE roleId = 3;
```

如果 `total > 0`，通常不允许删除。

---

### 3.7 删除角色

```sql
DELETE FROM Roles
WHERE roleId = 3;
```

如果有中间表，一般先删中间表关联：

```sql
DELETE FROM RoleRoute
WHERE roleId = 3;

DELETE FROM Roles
WHERE roleId = 3;
```

---

## 4. 菜单管理 SQL

### 4.1 查询菜单列表

```sql
SELECT
  id,
  path,
  name,
  component,
  redirect,
  meta,
  parent_id
FROM RouteAuth
ORDER BY COALESCE(parent_id, 0), id ASC;
```

---

### 4.2 查询某个菜单详情

```sql
SELECT
  id,
  path,
  name,
  component,
  redirect,
  meta,
  parent_id
FROM RouteAuth
WHERE id = 64
LIMIT 1;
```

---

### 4.3 检查菜单路径是否重复

```sql
SELECT id, path
FROM RouteAuth
WHERE path = '/system/accountManage'
LIMIT 1;
```

---

### 4.4 检查菜单名称是否重复

```sql
SELECT id, name
FROM RouteAuth
WHERE name = 'accountManage'
LIMIT 1;
```

---

### 4.5 新增菜单

```sql
INSERT INTO RouteAuth (
  path,
  name,
  component,
  redirect,
  meta,
  parent_id
)
VALUES (
  '/system/logManage',
  'logManage',
  '/system/logManage/index',
  NULL,
  JSON_OBJECT(
    'icon', 'Menu',
    'title', '日志管理',
    'isFull', false,
    'isHide', false,
    'isLink', '',
    'isAffix', false,
    'isKeepAlive', true
  ),
  61
);
```

---

### 4.6 更新菜单

```sql
UPDATE RouteAuth
SET
  path = '/system/logManage',
  name = 'logManage',
  component = '/system/logManage/index',
  redirect = NULL,
  meta = JSON_OBJECT(
    'icon', 'Menu',
    'title', '日志管理',
    'isFull', false,
    'isHide', false,
    'isLink', '',
    'isAffix', false,
    'isKeepAlive', true
  ),
  parent_id = 61
WHERE id = 80;
```

---

### 4.7 删除菜单前检查是否有子菜单

```sql
SELECT COUNT(*) AS total
FROM RouteAuth
WHERE parent_id = 61;
```

---

### 4.8 删除菜单

通常需要同时删除：

- 菜单本身
- 角色菜单关联
- 按钮权限关联

```sql
DELETE FROM ButtonAuth
WHERE routeId = 80;

DELETE FROM RoleRoute
WHERE routeId = 80;

DELETE FROM RouteAuth
WHERE id = 80;
```

---

## 5. 角色绑定菜单权限 SQL

### 5.1 查询某个角色已有的菜单 ID

```sql
SELECT routeId
FROM RoleRoute
WHERE roleId = 1
ORDER BY routeId ASC;
```

---

### 5.2 查询某个角色的菜单详情

```sql
SELECT
  ra.id,
  ra.path,
  ra.name,
  ra.component,
  ra.redirect,
  ra.meta,
  ra.parent_id
FROM RoleRoute rr
INNER JOIN RouteAuth ra ON ra.id = rr.routeId
WHERE rr.roleId = 1
ORDER BY COALESCE(ra.parent_id, 0), ra.id ASC;
```

---

### 5.3 给角色新增单个菜单权限

```sql
INSERT INTO RoleRoute (roleId, routeId)
VALUES (2, 64);
```

---

### 5.4 给角色批量绑定菜单权限

```sql
INSERT INTO RoleRoute (roleId, routeId)
VALUES
  (2, 64),
  (2, 65),
  (2, 66);
```

---

### 5.5 清空某个角色的菜单权限

```sql
DELETE FROM RoleRoute
WHERE roleId = 2;
```

---

### 5.6 重置角色菜单权限

这是后台管理最常见的角色授权更新写法。

```sql
START TRANSACTION;

DELETE FROM RoleRoute
WHERE roleId = 2;

INSERT INTO RoleRoute (roleId, routeId)
VALUES
  (2, 64),
  (2, 66),
  (2, 70);

COMMIT;
```

失败时：

```sql
ROLLBACK;
```

---

## 6. 按角色查询菜单树原始数据

菜单树通常不是 SQL 一次直接查成树，而是：

- SQL 查出平铺列表
- Node.js 再组装成树

查询原始数据：

```sql
SELECT DISTINCT
  ra.id,
  ra.path,
  ra.name,
  ra.component,
  ra.redirect,
  ra.meta,
  ra.parent_id
FROM RoleRoute rr
INNER JOIN RouteAuth ra ON ra.id = rr.routeId
WHERE rr.roleId = 1
ORDER BY COALESCE(ra.parent_id, 0), ra.id;
```

---

## 7. 按角色查询按钮权限

### 7.1 查询角色拥有的按钮权限

```sql
SELECT DISTINCT
  ba.buttonId,
  ba.routeId,
  ba.routeName,
  ba.buttonName
FROM RoleRoute rr
INNER JOIN ButtonAuth ba ON ba.routeId = rr.routeId
WHERE rr.roleId = 1
ORDER BY ba.routeId ASC, ba.buttonId ASC;
```

---

## 8. 登录认证相关 SQL

### 8.1 根据用户名查登录用户

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  u.avatar,
  u.roleId,
  u.password,
  r.roleName,
  r.description AS roleDescription
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.username = 'admin'
LIMIT 1;
```

这个 SQL 就非常适合后台登录接口。

---

### 8.2 根据用户 ID 查当前登录用户信息

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  u.avatar,
  u.roleId,
  r.roleName,
  r.description AS roleDescription
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.id = 1
LIMIT 1;
```

---

## 9. 菜单父子关系查询

### 9.1 查询菜单及其父级

```sql
SELECT
  child.id,
  child.name AS childName,
  child.path AS childPath,
  parent.id AS parentId,
  parent.name AS parentName
FROM RouteAuth child
LEFT JOIN RouteAuth parent ON parent.id = child.parent_id
ORDER BY child.id ASC;
```

这是典型的自连接写法。

---

### 9.2 查询某个父菜单下的子菜单

```sql
SELECT
  id,
  path,
  name,
  component,
  redirect,
  meta
FROM RouteAuth
WHERE parent_id = 61
ORDER BY id ASC;
```

---

## 10. 后台管理常用事务模板

### 10.1 创建角色并绑定菜单

```sql
START TRANSACTION;

INSERT INTO Roles (roleName, description)
VALUES ('operator', '运维角色');

-- 假设新角色 ID 为 5
INSERT INTO RoleRoute (roleId, routeId)
VALUES
  (5, 64),
  (5, 70);

COMMIT;
```

---

### 10.2 删除菜单并清理关联数据

```sql
START TRANSACTION;

DELETE FROM ButtonAuth
WHERE routeId = 80;

DELETE FROM RoleRoute
WHERE routeId = 80;

DELETE FROM RouteAuth
WHERE id = 80;

COMMIT;
```

---

## 11. 动态 SQL 拼接思路

后台管理里的筛选条件通常不是固定的，所以服务端经常需要动态拼接 SQL。

示例目标：

- keyword 可选
- status 可选
- roleId 可选

最终 SQL 通常长这样：

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE 1 = 1
  AND (u.username LIKE '%tom%' OR u.email LIKE '%tom%')
  AND u.status = 'active'
  AND u.roleId = 2
ORDER BY u.id DESC
LIMIT 0, 10;
```

Node.js 里常见做法：

- 先维护 `where` 数组
- 每命中一个条件就 `push`
- 最后 `join(' and ')`

---

## 12. 后台管理开发建议

### 12.1 列表接口通常需要返回

- `list`
- `total`
- 当前筛选条件下的辅助选项

例如用户列表：

- 用户列表数据
- 总数
- 角色选项

---

### 12.2 删除操作尽量分三步

1. 先查数据是否存在
2. 再判断是否允许删除
3. 最后执行删除

例如删除角色：

- 先查角色是否存在
- 再查是否还有用户绑定该角色
- 最后才删除

---

### 12.3 更新操作尽量先做唯一性校验

例如更新用户邮箱：

```sql
SELECT id, email
FROM Users
WHERE email = 'new@example.com'
  AND id <> 10
LIMIT 1;
```

如果查到数据，说明新邮箱被别的用户占用了。

---

## 13. 一组完整示例：用户管理分页接口

### 13.1 查列表

```sql
SELECT
  u.id,
  u.username,
  u.email,
  u.status,
  u.roleId,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE (u.username LIKE '%admin%' OR u.email LIKE '%admin%')
  AND u.status = 'active'
ORDER BY u.id DESC
LIMIT 0, 10;
```

### 13.2 查总数

```sql
SELECT COUNT(*) AS total
FROM Users u
WHERE (u.username LIKE '%admin%' OR u.email LIKE '%admin%')
  AND u.status = 'active';
```

### 13.3 查角色选项

```sql
SELECT roleId, roleName
FROM Roles
ORDER BY roleId ASC;
```

这三条 SQL 组合起来，就是典型后台分页接口的数据来源。

---

## 14. 一组完整示例：角色授权接口

### 14.1 查询角色已有菜单

```sql
SELECT routeId
FROM RoleRoute
WHERE roleId = 2;
```

### 14.2 重置角色菜单关系

```sql
START TRANSACTION;

DELETE FROM RoleRoute
WHERE roleId = 2;

INSERT INTO RoleRoute (roleId, routeId)
VALUES
  (2, 64),
  (2, 65),
  (2, 66);

COMMIT;
```

---

## 15. 小结

后台管理 SQL 的核心并不复杂，真正高频的是下面这些组合：

- 单表分页 + 总数统计
- 用户表和角色表 `LEFT JOIN`
- 角色表和菜单表通过中间表关联
- 菜单表自连接查询父子结构
- 更新授权时使用事务

如果你后面要继续做：

- 部门管理
- 字典管理
- 日志管理
- 操作审计

基本也都是沿着这套 SQL 模式扩展。 
