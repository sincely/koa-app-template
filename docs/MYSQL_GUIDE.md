# MySQL 语法与 CRUD 指南

这份文档面向项目开发场景，重点覆盖：

- MySQL 常用基础语法
- 如何创建、修改、删除数据表
- 如何做 `CRUD`
- 如何写单表查询
- 如何写多表查询
- 如何把查询思路映射到当前项目里的后台管理表

---

## 1. 基本概念

MySQL 是关系型数据库，核心对象通常包括：

- `database`：数据库
- `table`：数据表
- `row`：一行数据
- `column`：字段
- `primary key`：主键
- `foreign key`：外键
- `index`：索引

常见 SQL 分类：

- `DDL`：定义结构，例如 `CREATE`、`ALTER`、`DROP`
- `DML`：操作数据，例如 `INSERT`、`UPDATE`、`DELETE`
- `DQL`：查询数据，核心是 `SELECT`
- `DCL/TCL`：权限与事务，例如 `GRANT`、`COMMIT`、`ROLLBACK`

---

## 2. 常用数据类型

```sql
INT                -- 整数
BIGINT             -- 大整数
DECIMAL(10,2)      -- 精确小数
VARCHAR(255)       -- 变长字符串
TEXT               -- 长文本
DATETIME           -- 日期时间
TIMESTAMP          -- 时间戳
BOOLEAN            -- 布尔，MySQL 本质上通常映射为 TINYINT(1)
JSON               -- JSON 数据
```

字段定义示例：

```sql
username VARCHAR(50) NOT NULL
status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active'
createTime DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

## 3. 数据库与数据表操作

### 3.1 创建数据库

```sql
CREATE DATABASE koa_app DEFAULT CHARACTER SET utf8mb4;
```

### 3.2 使用数据库

```sql
USE koa_app;
```

### 3.3 查看数据库

```sql
SHOW DATABASES;
```

### 3.4 查看当前数据库中的表

```sql
SHOW TABLES;
```

### 3.5 查看表结构

```sql
DESC Users;
SHOW CREATE TABLE Users;
```

---

## 4. 建表示例

下面用你项目里后台管理相关表举例。

### 4.1 用户表

```sql
CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL DEFAULT 'other',
  age INT DEFAULT NULL,
  idCard VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  createTime TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
  avatar VARCHAR(255) DEFAULT NULL,
  roleId INT DEFAULT NULL,
  password VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_id_card (idCard),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_role_id (roleId)
);
```

### 4.2 角色表

```sql
CREATE TABLE Roles (
  roleId INT NOT NULL AUTO_INCREMENT,
  roleName VARCHAR(50) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (roleId),
  UNIQUE KEY uk_roles_role_name (roleName)
);
```

### 4.3 菜单表

```sql
CREATE TABLE RouteAuth (
  id INT NOT NULL AUTO_INCREMENT,
  path VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  component VARCHAR(255) DEFAULT NULL,
  redirect VARCHAR(255) DEFAULT NULL,
  meta JSON DEFAULT NULL,
  parent_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_route_parent_id (parent_id)
);
```

### 4.4 角色菜单关联表

```sql
CREATE TABLE RoleRoute (
  roleRouteId INT NOT NULL AUTO_INCREMENT,
  roleId INT NOT NULL,
  routeId INT NOT NULL,
  PRIMARY KEY (roleRouteId),
  UNIQUE KEY uk_role_route (roleId, routeId),
  KEY idx_role_route_role_id (roleId),
  KEY idx_role_route_route_id (routeId)
);
```

---

## 5. ALTER 修改表结构

### 5.1 新增字段

```sql
ALTER TABLE Users ADD COLUMN phone VARCHAR(20) DEFAULT NULL;
```

### 5.2 修改字段类型

```sql
ALTER TABLE Users MODIFY COLUMN username VARCHAR(100) NOT NULL;
```

### 5.3 修改字段名

```sql
ALTER TABLE Users CHANGE COLUMN phone mobile VARCHAR(20) DEFAULT NULL;
```

### 5.4 删除字段

```sql
ALTER TABLE Users DROP COLUMN mobile;
```

### 5.5 新增索引

```sql
ALTER TABLE Users ADD INDEX idx_users_status (status);
```

### 5.6 新增外键

```sql
ALTER TABLE Users
ADD CONSTRAINT fk_users_role
FOREIGN KEY (roleId) REFERENCES Roles(roleId);
```

---

## 6. DROP/TRUNCATE/DELETE 的区别

### 6.1 删除表

```sql
DROP TABLE Users;
```

特点：

- 表结构和数据都没了
- 一般不可恢复

### 6.2 清空表

```sql
TRUNCATE TABLE Users;
```

特点：

- 保留表结构
- 清空所有数据
- 通常比 `DELETE FROM Users` 更快

### 6.3 删除表中部分数据

```sql
DELETE FROM Users WHERE id = 10;
```

特点：

- 删除符合条件的数据
- 可配合 `WHERE`

---

## 7. INSERT 新增数据

### 7.1 插入单条

```sql
INSERT INTO Roles (roleName, description)
VALUES ('editor', '内容编辑角色');
```

### 7.2 插入多条

```sql
INSERT INTO Roles (roleName, description)
VALUES
  ('admin', '系统管理员'),
  ('user', '普通用户'),
  ('auditor', '审核员');
```

### 7.3 插入用户

```sql
INSERT INTO Users (
  username, gender, age, idCard, email, address, status, avatar, roleId, password
)
VALUES (
  'tom',
  'male',
  28,
  '110101199601011234',
  'tom@example.com',
  '上海市浦东新区',
  'active',
  '/avatars/tom.png',
  2,
  '$2b$10$xxxxxxxx'
);
```

### 7.4 插入时避免重复

```sql
INSERT IGNORE INTO Roles (roleName, description)
VALUES ('admin', '系统管理员');
```

### 7.5 已存在则更新

```sql
INSERT INTO Roles (roleId, roleName, description)
VALUES (1, 'admin', '系统管理员')
ON DUPLICATE KEY UPDATE
  description = VALUES(description);
```

---

## 8. SELECT 单表查询

### 8.1 查询全部字段

```sql
SELECT * FROM Users;
```

### 8.2 查询指定字段

```sql
SELECT id, username, email, status
FROM Users;
```

### 8.3 条件查询

```sql
SELECT id, username, email
FROM Users
WHERE status = 'active';
```

### 8.4 多条件查询

```sql
SELECT id, username, email
FROM Users
WHERE status = 'active'
  AND roleId = 1;
```

### 8.5 `OR` 查询

```sql
SELECT id, username, status
FROM Users
WHERE status = 'inactive'
   OR status = 'banned';
```

### 8.6 模糊查询

```sql
SELECT id, username, email
FROM Users
WHERE username LIKE '%adm%';
```

说明：

- `%abc%`：包含 `abc`
- `abc%`：以 `abc` 开头
- `%abc`：以 `abc` 结尾

### 8.7 范围查询

```sql
SELECT id, username, age
FROM Users
WHERE age BETWEEN 18 AND 30;
```

### 8.8 集合查询

```sql
SELECT id, username, status
FROM Users
WHERE status IN ('active', 'inactive');
```

### 8.9 空值查询

```sql
SELECT id, username
FROM Users
WHERE avatar IS NULL;
```

```sql
SELECT id, username
FROM Users
WHERE avatar IS NOT NULL;
```

### 8.10 排序

```sql
SELECT id, username, createTime
FROM Users
ORDER BY createTime DESC;
```

### 8.11 分页

```sql
SELECT id, username, email
FROM Users
ORDER BY id DESC
LIMIT 0, 10;
```

分页说明：

- `LIMIT 0, 10`：第 1 页，每页 10 条
- `LIMIT 10, 10`：第 2 页，每页 10 条

通用公式：

```sql
LIMIT (page - 1) * pageSize, pageSize;
```

### 8.12 去重

```sql
SELECT DISTINCT status
FROM Users;
```

---

## 9. UPDATE 更新数据

### 9.1 更新单条

```sql
UPDATE Users
SET status = 'inactive'
WHERE id = 1;
```

### 9.2 更新多个字段

```sql
UPDATE Users
SET
  email = 'newmail@example.com',
  address = '北京市海淀区',
  roleId = 1
WHERE id = 2;
```

### 9.3 按条件批量更新

```sql
UPDATE Users
SET status = 'banned'
WHERE age < 18;
```

### 9.4 使用表达式更新

```sql
UPDATE Users
SET age = age + 1
WHERE id = 3;
```

注意：

- 更新前尽量先用同样的 `WHERE` 条件做一次 `SELECT`
- 没有 `WHERE` 会改整张表

危险写法：

```sql
UPDATE Users SET status = 'inactive';
```

---

## 10. DELETE 删除数据

### 10.1 删除单条

```sql
DELETE FROM Users
WHERE id = 3;
```

### 10.2 条件删除

```sql
DELETE FROM Users
WHERE status = 'inactive';
```

### 10.3 删除前先查询确认

```sql
SELECT * FROM Users WHERE id = 3;
DELETE FROM Users WHERE id = 3;
```

危险写法：

```sql
DELETE FROM Users;
```

---

## 11. 聚合函数与分组

常用聚合函数：

- `COUNT()`：计数
- `SUM()`：求和
- `AVG()`：平均值
- `MAX()`：最大值
- `MIN()`：最小值

### 11.1 统计总用户数

```sql
SELECT COUNT(*) AS total
FROM Users;
```

### 11.2 按状态分组统计

```sql
SELECT status, COUNT(*) AS total
FROM Users
GROUP BY status;
```

### 11.3 按角色统计用户数

```sql
SELECT roleId, COUNT(*) AS total
FROM Users
GROUP BY roleId;
```

### 11.4 分组后过滤

```sql
SELECT roleId, COUNT(*) AS total
FROM Users
GROUP BY roleId
HAVING COUNT(*) >= 2;
```

区别：

- `WHERE`：分组前过滤
- `HAVING`：分组后过滤

---

## 12. 单表查询综合示例

### 12.1 后台用户列表查询

这个例子和项目中的用户管理分页查询很接近：

```sql
SELECT
  id,
  username,
  gender,
  age,
  email,
  status,
  roleId,
  createTime
FROM Users
WHERE username LIKE '%tom%'
  AND status = 'active'
ORDER BY id DESC
LIMIT 0, 10;
```

### 12.2 统计满足条件的总数

```sql
SELECT COUNT(*) AS total
FROM Users
WHERE username LIKE '%tom%'
  AND status = 'active';
```

这就是分页接口通常会写的两条 SQL：

- 一条查列表
- 一条查总数

---

## 13. 多表查询基础

多表查询最常见的是 `JOIN`。

常见连接类型：

- `INNER JOIN`：只保留两表都匹配的数据
- `LEFT JOIN`：保留左表全部数据，右表没有则为 `NULL`
- `RIGHT JOIN`：保留右表全部数据
- `CROSS JOIN`：笛卡尔积，实际开发中较少直接使用

---

## 14. INNER JOIN 内连接

### 14.1 查询用户及其角色名

```sql
SELECT
  u.id,
  u.username,
  u.email,
  r.roleName
FROM Users u
INNER JOIN Roles r ON r.roleId = u.roleId;
```

含义：

- `Users` 里必须存在 `roleId`
- `Roles` 里必须有对应角色
- 才会出现在结果中

---

## 15. LEFT JOIN 左连接

### 15.1 查询所有用户，即使没绑定角色也显示

```sql
SELECT
  u.id,
  u.username,
  u.email,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId;
```

特点：

- 左表 `Users` 的数据全部保留
- 右表 `Roles` 没匹配上时，`roleName` 为 `NULL`

这类写法更适合后台管理列表页。

---

## 16. 多表查询项目实战

### 16.1 查询用户列表并展示角色名

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
ORDER BY u.id DESC
LIMIT 0, 10;
```

### 16.2 查询角色及该角色下用户数量

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

### 16.3 查询角色拥有的菜单

```sql
SELECT
  r.roleId,
  r.roleName,
  ra.id AS menuId,
  ra.path,
  ra.name
FROM Roles r
INNER JOIN RoleRoute rr ON rr.roleId = r.roleId
INNER JOIN RouteAuth ra ON ra.id = rr.routeId
WHERE r.roleId = 1
ORDER BY ra.id ASC;
```

### 16.4 查询菜单及其父级菜单

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

这就是典型的自连接。

---

## 17. 多表查询中的别名

表别名能让 SQL 更清晰：

```sql
SELECT
  u.username,
  r.roleName
FROM Users AS u
LEFT JOIN Roles AS r ON r.roleId = u.roleId;
```

字段别名：

```sql
SELECT
  u.username AS userName,
  r.roleName AS roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId;
```

---

## 18. 子查询

### 18.1 查询管理员角色下的所有用户

```sql
SELECT id, username, email
FROM Users
WHERE roleId = (
  SELECT roleId
  FROM Roles
  WHERE roleName = 'admin'
);
```

### 18.2 查询拥有菜单权限的角色

```sql
SELECT roleId, roleName
FROM Roles
WHERE roleId IN (
  SELECT roleId
  FROM RoleRoute
  WHERE routeId = 64
);
```

### 18.3 作为临时结果集使用

```sql
SELECT t.roleId, t.total
FROM (
  SELECT roleId, COUNT(*) AS total
  FROM Users
  GROUP BY roleId
) t
WHERE t.total >= 2;
```

---

## 19. EXISTS 用法

### 19.1 查询至少有一个用户的角色

```sql
SELECT r.roleId, r.roleName
FROM Roles r
WHERE EXISTS (
  SELECT 1
  FROM Users u
  WHERE u.roleId = r.roleId
);
```

---

## 20. 常见排序与分页组合

```sql
SELECT
  u.id,
  u.username,
  u.email,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.status = 'active'
ORDER BY u.createTime DESC, u.id DESC
LIMIT 0, 20;
```

推荐顺序：

```sql
SELECT ...
FROM ...
JOIN ...
WHERE ...
GROUP BY ...
HAVING ...
ORDER BY ...
LIMIT ...
```

---

## 21. 事务处理

事务适合“要么都成功，要么都失败”的场景。

例如角色更新时：

- 更新角色信息
- 删除旧的角色菜单关系
- 插入新的角色菜单关系

SQL 写法：

```sql
START TRANSACTION;

UPDATE Roles
SET roleName = 'editor', description = '编辑角色'
WHERE roleId = 3;

DELETE FROM RoleRoute
WHERE roleId = 3;

INSERT INTO RoleRoute (roleId, routeId)
VALUES
  (3, 64),
  (3, 65),
  (3, 66);

COMMIT;
```

出错时回滚：

```sql
ROLLBACK;
```

---

## 22. 索引基础

适合加索引的字段：

- 经常用于 `WHERE`
- 经常用于 `JOIN`
- 经常用于 `ORDER BY`
- 经常用于唯一校验

示例：

```sql
CREATE INDEX idx_users_status ON Users(status);
CREATE INDEX idx_users_role_id ON Users(roleId);
CREATE UNIQUE INDEX uk_roles_role_name ON Roles(roleName);
```

注意：

- 索引不是越多越好
- 索引会增加写入成本
- 对小表不一定收益明显

---

## 23. 常见 SQL 排错思路

### 23.1 先查结构

```sql
DESC Users;
SHOW CREATE TABLE Users;
```

### 23.2 先写简单查询，再逐步加条件

```sql
SELECT * FROM Users;
SELECT * FROM Users WHERE status = 'active';
SELECT * FROM Users WHERE status = 'active' AND roleId = 1;
```

### 23.3 JOIN 查不到数据时检查

- 连接字段类型是否一致
- 是否写错了 `ON`
- 数据本身是否存在
- 该场景应不应该用 `LEFT JOIN`

### 23.4 更新或删除前先 `SELECT`

```sql
SELECT * FROM Users WHERE id = 10;
UPDATE Users SET status = 'inactive' WHERE id = 10;
```

---

## 24. 适合后台管理的常见 SQL 模板

### 24.1 列表 + 总数

```sql
SELECT ...
FROM Users
WHERE ...
ORDER BY id DESC
LIMIT ?, ?;

SELECT COUNT(*) AS total
FROM Users
WHERE ...;
```

### 24.2 根据角色查菜单

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
WHERE rr.roleId = ?
ORDER BY COALESCE(ra.parent_id, 0), ra.id;
```

### 24.3 查询按钮权限

```sql
SELECT DISTINCT
  ba.buttonId,
  ba.routeId,
  ba.routeName,
  ba.buttonName
FROM RoleRoute rr
INNER JOIN ButtonAuth ba ON ba.routeId = rr.routeId
WHERE rr.roleId = ?
ORDER BY ba.routeId ASC, ba.buttonId ASC;
```

---

## 25. 学习建议

建议按这个顺序练习：

1. 先熟悉 `SELECT / INSERT / UPDATE / DELETE`
2. 再掌握 `WHERE / ORDER BY / LIMIT / GROUP BY`
3. 再练 `INNER JOIN / LEFT JOIN`
4. 最后学习事务、子查询、索引优化

最实用的方法不是背语法，而是围绕真实业务写 SQL：

- 用户列表怎么查
- 角色怎么绑定菜单
- 菜单树怎么查父子关系
- 分页和总数怎么一起返回

---

## 26. 小结

你在这个项目里最常用的 MySQL 能力，大概率集中在下面这些：

- 建表与改表
- 基础 `CRUD`
- 单表分页查询
- 用户和角色的 `LEFT JOIN`
- 角色和菜单的多表关联查询
- 菜单表的自连接查询
- 事务处理角色权限更新

如果后面你需要，我还可以继续给你补两份内容：

- `MySQL 后台管理实战 SQL 例子`
- `MySQL 索引优化与 EXPLAIN 指南`
