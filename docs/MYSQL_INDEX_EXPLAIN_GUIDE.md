# MySQL 索引优化与 EXPLAIN 指南

这份文档重点解决两个问题：

- SQL 为什么慢
- 怎么用索引和 `EXPLAIN` 找出问题

适合后台管理项目日常排查：

- 用户列表慢
- 搜索慢
- 多表关联慢
- 排序分页慢

---

## 1. 什么是索引

索引可以理解成数据库里的“目录”。

没有索引时，数据库可能需要一行一行扫描整张表；
有索引时，数据库可以更快定位到目标数据。

索引最常用于这些场景：

- `WHERE`
- `JOIN ON`
- `ORDER BY`
- `GROUP BY`
- 唯一性约束

---

## 2. 索引的常见类型

### 2.1 主键索引

```sql
PRIMARY KEY (id)
```

特点：

- 唯一
- 不能为空
- 一张表只能有一个主键

---

### 2.2 唯一索引

```sql
CREATE UNIQUE INDEX uk_users_email ON Users(email);
```

特点：

- 不允许重复
- 适合邮箱、用户名、角色名等字段

---

### 2.3 普通索引

```sql
CREATE INDEX idx_users_status ON Users(status);
```

特点：

- 用于提升查询速度
- 不保证唯一

---

### 2.4 联合索引

```sql
CREATE INDEX idx_users_status_role_id ON Users(status, roleId);
```

特点：

- 多字段组合
- 很适合后台筛选条件组合查询

---

## 3. 为什么 SQL 会慢

常见原因：

- 没有索引
- 索引建错了
- 用了函数，导致索引失效
- `LIKE '%keyword%'` 前缀模糊无法高效走索引
- `JOIN` 字段没索引
- 排序字段没索引
- 返回字段太多，出现回表成本
- 分页过深，比如 `LIMIT 100000, 20`

---

## 4. 如何查看 SQL 执行计划

使用 `EXPLAIN`：

```sql
EXPLAIN
SELECT
  u.id,
  u.username,
  u.email,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.status = 'active'
ORDER BY u.id DESC
LIMIT 0, 10;
```

如果是 MySQL 8，也可以用：

```sql
EXPLAIN FORMAT=TRADITIONAL
SELECT ...
```

或者：

```sql
EXPLAIN ANALYZE
SELECT ...
```

`EXPLAIN ANALYZE` 会实际执行 SQL，并输出更接近真实运行过程的信息。

---

## 5. EXPLAIN 关键字段怎么看

最常见的列：

- `id`
- `select_type`
- `table`
- `type`
- `possible_keys`
- `key`
- `rows`
- `filtered`
- `Extra`

---

## 6. `type` 很重要

`type` 反映访问方式，通常越靠前越好。

常见从好到差大致如下：

- `system`
- `const`
- `eq_ref`
- `ref`
- `range`
- `index`
- `ALL`

重点理解：

- `const`：主键或唯一索引精确匹配，性能非常好
- `ref`：普通索引等值匹配，通常也不错
- `range`：范围扫描，例如 `BETWEEN`、`> <`
- `ALL`：全表扫描，通常要重点关注

如果后台列表查询经常出现 `ALL`，基本要排查索引。

---

## 7. `key` 看是否真的用了索引

### 7.1 示例

```sql
EXPLAIN
SELECT *
FROM Users
WHERE email = 'admin@example.com';
```

如果结果里：

- `possible_keys` 有值
- `key` 也有值

说明索引被选中了。

如果：

- `possible_keys` 有值
- `key` 是 `NULL`

说明 MySQL 认为不用索引更划算，或者 SQL 写法让索引没生效。

---

## 8. `rows` 估算扫描行数

`rows` 代表优化器预估要扫描多少行。

例如：

- `rows = 1`：通常很好
- `rows = 100`：一般可以接受
- `rows = 100000`：要警惕

后台管理列表如果只取 10 条，但 `rows` 很大，说明查找成本高。

---

## 9. `Extra` 重点关注什么

常见值：

- `Using where`
- `Using index`
- `Using temporary`
- `Using filesort`

### 9.1 `Using index`

通常是好信号，说明使用了覆盖索引。

### 9.2 `Using temporary`

说明 MySQL 可能创建了临时表，常见于复杂分组和排序。

### 9.3 `Using filesort`

说明排序没能直接利用索引，需要额外排序。

后台列表页如果大量出现 `Using filesort`，通常说明 `ORDER BY` 可以优化。

---

## 10. 创建索引语法

### 10.1 普通索引

```sql
CREATE INDEX idx_users_role_id ON Users(roleId);
```

### 10.2 唯一索引

```sql
CREATE UNIQUE INDEX uk_users_email ON Users(email);
```

### 10.3 联合索引

```sql
CREATE INDEX idx_users_status_role_id_id ON Users(status, roleId, id);
```

### 10.4 删除索引

```sql
DROP INDEX idx_users_role_id ON Users;
```

### 10.5 查看索引

```sql
SHOW INDEX FROM Users;
```

---

## 11. 当前项目适合加索引的字段

结合你这个后台管理项目，优先考虑这些字段：

### 11.1 `Users` 表

- `username`
- `email`
- `idCard`
- `roleId`
- `status`
- `createTime`

建议：

```sql
CREATE UNIQUE INDEX uk_users_username ON Users(username);
CREATE UNIQUE INDEX uk_users_email ON Users(email);
CREATE UNIQUE INDEX uk_users_id_card ON Users(idCard);
CREATE INDEX idx_users_role_id ON Users(roleId);
CREATE INDEX idx_users_status ON Users(status);
CREATE INDEX idx_users_create_time ON Users(createTime);
```

---

### 11.2 `Roles` 表

- `roleName`

```sql
CREATE UNIQUE INDEX uk_roles_role_name ON Roles(roleName);
```

---

### 11.3 `RouteAuth` 表

- `path`
- `name`
- `parent_id`

```sql
CREATE UNIQUE INDEX uk_route_auth_path ON RouteAuth(path);
CREATE UNIQUE INDEX uk_route_auth_name ON RouteAuth(name);
CREATE INDEX idx_route_auth_parent_id ON RouteAuth(parent_id);
```

---

### 11.4 `RoleRoute` 表

- `(roleId, routeId)`
- `routeId`

```sql
CREATE UNIQUE INDEX uk_role_route ON RoleRoute(roleId, routeId);
CREATE INDEX idx_role_route_route_id ON RoleRoute(routeId);
```

---

### 11.5 `ButtonAuth` 表

- `routeId`
- `buttonName`

```sql
CREATE INDEX idx_button_auth_route_id ON ButtonAuth(routeId);
```

---

## 12. 后台管理常见 SQL 优化案例

### 12.1 用户列表按状态筛选

原 SQL：

```sql
SELECT id, username, email, status
FROM Users
WHERE status = 'active'
ORDER BY id DESC
LIMIT 0, 10;
```

建议索引：

```sql
CREATE INDEX idx_users_status_id ON Users(status, id);
```

原因：

- `status` 用于过滤
- `id` 用于排序
- 联合索引能同时兼顾条件和顺序

---

### 12.2 用户按角色筛选

```sql
SELECT id, username, email, roleId
FROM Users
WHERE roleId = 2
ORDER BY id DESC
LIMIT 0, 10;
```

建议索引：

```sql
CREATE INDEX idx_users_role_id_id ON Users(roleId, id);
```

---

### 12.3 角色查菜单

```sql
SELECT
  ra.id,
  ra.path,
  ra.name
FROM RoleRoute rr
INNER JOIN RouteAuth ra ON ra.id = rr.routeId
WHERE rr.roleId = 1
ORDER BY ra.id ASC;
```

建议索引：

```sql
CREATE UNIQUE INDEX uk_role_route ON RoleRoute(roleId, routeId);
CREATE INDEX idx_role_route_route_id ON RoleRoute(routeId);
```

原因：

- `rr.roleId = ?` 经常查
- `rr.routeId` 经常参与关联

---

### 12.4 菜单树查询

```sql
SELECT id, path, name, parent_id
FROM RouteAuth
ORDER BY COALESCE(parent_id, 0), id ASC;
```

这里 `ORDER BY COALESCE(parent_id, 0)` 不容易直接利用普通索引。

更推荐：

```sql
SELECT id, path, name, parent_id
FROM RouteAuth
ORDER BY parent_id ASC, id ASC;
```

再配合索引：

```sql
CREATE INDEX idx_route_auth_parent_id_id ON RouteAuth(parent_id, id);
```

---

## 13. 最左前缀原则

联合索引：

```sql
CREATE INDEX idx_users_status_role_id_id ON Users(status, roleId, id);
```

它可以支持：

```sql
WHERE status = 'active'
WHERE status = 'active' AND roleId = 2
WHERE status = 'active' AND roleId = 2 ORDER BY id DESC
```

但不一定能很好支持：

```sql
WHERE roleId = 2
WHERE id = 10
```

因为联合索引遵循最左前缀原则，要从左边字段开始用。

---

## 14. 什么 SQL 会让索引失效

### 14.1 在字段上做函数

不推荐：

```sql
SELECT *
FROM Users
WHERE DATE(createTime) = '2026-04-10';
```

推荐：

```sql
SELECT *
FROM Users
WHERE createTime >= '2026-04-10 00:00:00'
  AND createTime < '2026-04-11 00:00:00';
```

---

### 14.2 前缀模糊

不推荐：

```sql
WHERE username LIKE '%adm%'
```

原因：

- 前面有 `%`
- 普通 B+Tree 索引无法高效使用

相对更容易利用索引的是：

```sql
WHERE username LIKE 'adm%'
```

---

### 14.3 字段类型不一致

例如字段是 `INT`，查询时却传字符串并发生隐式转换，可能影响索引使用。

---

### 14.4 使用 `OR` 连接多个未建索引字段

例如：

```sql
WHERE username = 'admin' OR address = '北京'
```

如果 `address` 没索引，优化器可能直接走全表扫描。

---

## 15. 覆盖索引

覆盖索引指的是：

- 查询需要的字段
- 全部都在索引里
- 不需要再回表取数据

例如索引：

```sql
CREATE INDEX idx_users_status_id_username ON Users(status, id, username);
```

SQL：

```sql
SELECT id, username
FROM Users
WHERE status = 'active'
ORDER BY id DESC
LIMIT 0, 10;
```

如果执行计划里出现 `Using index`，说明可能走了覆盖索引。

---

## 16. 分页优化

### 16.1 普通分页

```sql
SELECT id, username, email
FROM Users
ORDER BY id DESC
LIMIT 0, 20;
```

问题不大。

### 16.2 深分页问题

```sql
SELECT id, username, email
FROM Users
ORDER BY id DESC
LIMIT 100000, 20;
```

问题：

- MySQL 需要先跳过前 100000 行
- 非常耗时

### 16.3 优化方式：基于游标/上一页最后一条记录

```sql
SELECT id, username, email
FROM Users
WHERE id < 900000
ORDER BY id DESC
LIMIT 20;
```

这种方式在大表下通常更高效。

---

## 17. 排序优化

### 17.1 容易导致 filesort 的写法

```sql
SELECT id, username, status
FROM Users
WHERE status = 'active'
ORDER BY createTime DESC;
```

如果只有 `status` 索引，没有 `status + createTime` 联合索引，可能出现：

- `Using where`
- `Using filesort`

优化思路：

```sql
CREATE INDEX idx_users_status_create_time ON Users(status, createTime);
```

---

## 18. JOIN 优化

### 18.1 关联字段必须尽量有索引

例如：

```sql
SELECT
  u.id,
  u.username,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId;
```

建议：

- `Users.roleId` 有索引
- `Roles.roleId` 是主键或唯一索引

---

### 18.2 小表驱动大表

虽然优化器会自己选择，但在设计 SQL 时最好让过滤条件更强的表先缩小结果集。

例如查询某个角色的菜单：

```sql
SELECT
  ra.id,
  ra.path,
  ra.name
FROM RoleRoute rr
INNER JOIN RouteAuth ra ON ra.id = rr.routeId
WHERE rr.roleId = 1;
```

这里先用 `rr.roleId = 1` 过滤，比先全量扫 `RouteAuth` 再关联更合理。

---

## 19. EXPLAIN 实战示例

### 19.1 用户列表查询

SQL：

```sql
EXPLAIN
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

重点看：

- `u` 表的 `type`
- `u` 表用了哪个 `key`
- `rows` 是否很大
- `Extra` 是否有 `Using filesort`

如果 `type = ALL` 且 `rows` 很大，通常要给 `Users(status, id)` 加索引。

---

### 19.2 角色菜单查询

SQL：

```sql
EXPLAIN
SELECT
  ra.id,
  ra.path,
  ra.name
FROM RoleRoute rr
INNER JOIN RouteAuth ra ON ra.id = rr.routeId
WHERE rr.roleId = 1
ORDER BY ra.id ASC;
```

重点看：

- `rr` 是否使用了 `(roleId, routeId)` 联合索引
- `ra` 是否通过主键查找

理想情况通常是：

- `rr` 用 `ref`
- `ra` 用 `eq_ref`

---

### 19.3 菜单名称精确查询

```sql
EXPLAIN
SELECT id, path, name
FROM RouteAuth
WHERE name = 'menuManage'
LIMIT 1;
```

如果给 `name` 建了唯一索引，通常访问方式会非常好。

---

## 20. EXPLAIN ANALYZE 怎么用

如果 MySQL 版本支持，可以用：

```sql
EXPLAIN ANALYZE
SELECT
  u.id,
  u.username,
  r.roleName
FROM Users u
LEFT JOIN Roles r ON r.roleId = u.roleId
WHERE u.roleId = 1
ORDER BY u.id DESC
LIMIT 20;
```

相比普通 `EXPLAIN`，它的优势是：

- 会真正执行 SQL
- 能看到更真实的耗时
- 更容易发现瓶颈步骤

缺点：

- 成本更高
- 不适合对超重 SQL 频繁跑

---

## 21. 索引不是越多越好

索引的副作用：

- 占用磁盘空间
- `INSERT / UPDATE / DELETE` 变慢
- 维护成本增加

例如 `Users` 表如果每个字段都建索引：

- 写入会变慢
- 真正常用的索引反而不清晰

正确思路是：

- 为高频过滤字段建索引
- 为高频关联字段建索引
- 为高频排序字段建索引
- 基于真实 SQL 设计联合索引

---

## 22. 索引设计建议

### 22.1 针对后台用户列表

高频条件通常是：

- `status`
- `roleId`
- `id DESC`

可以考虑：

```sql
CREATE INDEX idx_users_status_role_id_id ON Users(status, roleId, id);
```

如果你也经常单独按 `roleId` 查：

```sql
CREATE INDEX idx_users_role_id_id ON Users(roleId, id);
```

---

### 22.2 针对登录

登录高频按 `username` 精确查：

```sql
CREATE UNIQUE INDEX uk_users_username ON Users(username);
```

---

### 22.3 针对角色授权

```sql
CREATE UNIQUE INDEX uk_role_route ON RoleRoute(roleId, routeId);
CREATE INDEX idx_role_route_route_id ON RoleRoute(routeId);
```

---

## 23. 典型慢 SQL 排查流程

建议按这个顺序排查：

1. 先确认慢的是哪条 SQL
2. 用 `EXPLAIN` 看执行计划
3. 重点关注 `type`、`key`、`rows`、`Extra`
4. 判断是否需要索引
5. 判断 SQL 是否可改写
6. 重新执行 `EXPLAIN`
7. 对比优化前后效果

---

## 24. 一个完整优化案例

### 24.1 原 SQL

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
  AND u.roleId = 2
ORDER BY u.id DESC
LIMIT 0, 20;
```

### 24.2 问题

如果只有：

- 主键索引 `Users.id`

那可能：

- 先扫描大量数据
- 再过滤 `status` 和 `roleId`

### 24.3 优化

增加联合索引：

```sql
CREATE INDEX idx_users_status_role_id_id ON Users(status, roleId, id);
```

### 24.4 优化后收益

- `WHERE` 更快
- `ORDER BY id DESC` 更容易利用索引顺序
- `rows` 估算值通常下降
- `filesort` 可能减少

---

## 25. 常用排查命令汇总

查看表结构：

```sql
DESC Users;
SHOW CREATE TABLE Users;
```

查看索引：

```sql
SHOW INDEX FROM Users;
SHOW INDEX FROM RoleRoute;
```

执行计划：

```sql
EXPLAIN SELECT * FROM Users WHERE roleId = 1;
EXPLAIN ANALYZE SELECT * FROM Users WHERE roleId = 1;
```

删除索引：

```sql
DROP INDEX idx_users_status ON Users;
```

新增索引：

```sql
CREATE INDEX idx_users_status ON Users(status);
```

---

## 26. 小结

你在这个项目里做后台管理时，索引优化最值得优先关注的是：

- `Users.username`
- `Users.email`
- `Users.roleId`
- `Users.status`
- `RouteAuth.path`
- `RouteAuth.name`
- `RouteAuth.parent_id`
- `RoleRoute(roleId, routeId)`

排查性能时，最关键的不是“猜”，而是：

- 先拿到真实 SQL
- 再跑 `EXPLAIN`
- 看是否命中索引
- 再针对查询模式设计索引

如果你愿意，我下一步还可以继续补：

- `MySQL 事务与锁机制指南`
- `后台管理数据库设计规范` 
