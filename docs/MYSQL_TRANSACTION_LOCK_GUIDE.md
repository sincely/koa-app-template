# MySQL 事务与锁机制指南

这份文档重点解决两个问题：

- 事务是什么，什么时候该用事务
- 锁是什么，为什么会阻塞、死锁、并发冲突

这份指南适合后台管理项目开发，尤其是这些场景：

- 用户/角色/菜单批量更新
- 角色授权重置
- 同一条数据被多人同时修改
- 删除和更新同时发生
- 高并发下的数据一致性问题

---

## 1. 什么是事务

事务是一组 SQL 操作，这组操作要么全部成功，要么全部失败。

例如后台管理中“更新角色并重置角色菜单权限”，通常包含：

- 更新角色信息
- 删除旧权限
- 插入新权限

如果只成功一半，会导致脏数据，所以要放到同一个事务里。

---

## 2. 事务的四大特性 ACID

### 2.1 原子性 Atomicity

事务中的操作不可分割，要么全部成功，要么全部失败。

### 2.2 一致性 Consistency

事务执行前后，数据要保持逻辑一致。

### 2.3 隔离性 Isolation

多个事务并发执行时，彼此之间应该尽量互不干扰。

### 2.4 持久性 Durability

事务一旦提交，数据就应该被永久保存。

---

## 3. 事务基本语法

### 3.1 开启事务

```sql
START TRANSACTION;
```

或者：

```sql
BEGIN;
```

### 3.2 提交事务

```sql
COMMIT;
```

### 3.3 回滚事务

```sql
ROLLBACK;
```

---

## 4. 最基本的事务示例

### 4.1 角色授权更新

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

如果中间任何一步失败：

```sql
ROLLBACK;
```

---

## 5. 哪些后台场景一定要用事务

建议用事务的典型场景：

- 创建角色并同时写入角色菜单关系
- 更新角色并重置角色菜单关系
- 删除菜单并同时清理中间表
- 批量新增/批量删除
- 涉及余额、库存、数量等累计值更新
- 先查再改且并发敏感的业务

不一定要用事务的场景：

- 单条普通查询
- 简单单表单行更新
- 纯只读统计接口

---

## 6. 自动提交 autocommit

MySQL 默认通常开启自动提交：

```sql
SELECT @@autocommit;
```

如果结果是 `1`，表示每条 SQL 默认自动提交。

关闭自动提交：

```sql
SET autocommit = 0;
```

但在实际项目里，更推荐：

- 保持自动提交开启
- 只有在需要时手动 `START TRANSACTION`

这样更安全，也更清晰。

---

## 7. 事务中的并发问题

如果没有合适的隔离机制，并发事务可能带来这些问题：

### 7.1 脏读

一个事务读到了另一个事务尚未提交的数据。

### 7.2 不可重复读

同一个事务里，两次读取同一条数据，结果不一致。

### 7.3 幻读

同一个事务里，两次按条件查询，第二次多出或少了“符合条件的行”。

---

## 8. 事务隔离级别

MySQL 常见隔离级别有 4 个：

### 8.1 READ UNCOMMITTED

最低级别，可能发生脏读。

### 8.2 READ COMMITTED

可以避免脏读，但可能发生不可重复读。

### 8.3 REPEATABLE READ

MySQL InnoDB 默认隔离级别。

特点：

- 避免脏读
- 避免不可重复读
- 通过 MVCC 和间隙锁等机制尽量控制幻读

### 8.4 SERIALIZABLE

最高隔离级别，并发能力最弱。

---

## 9. 查看和设置隔离级别

查看当前会话隔离级别：

```sql
SELECT @@transaction_isolation;
```

设置当前会话隔离级别：

```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

开启事务：

```sql
START TRANSACTION;
```

一般后台管理系统，默认 `REPEATABLE READ` 已经够用。

---

## 10. 什么是锁

锁是数据库用来控制并发访问的一种机制。

简单理解：

- 我在改这条数据时
- 你先别改
- 或者你也别读到不该读的数据

锁的作用：

- 保证数据一致性
- 控制并发冲突
- 防止覆盖更新

---

## 11. 锁的分类

从开发中最常见的角度看，锁可以理解为：

- 共享锁
- 排他锁
- 行锁
- 表锁
- 意向锁
- 间隙锁
- 临键锁

其中后台项目最常遇到的是：

- 行锁
- 排他锁
- `SELECT ... FOR UPDATE`
- 死锁

---

## 12. 共享锁与排他锁

### 12.1 共享锁 Shared Lock

多个事务可以同时读，但不能写。

### 12.2 排他锁 Exclusive Lock

加了排他锁后，其他事务通常不能同时修改。

---

## 13. 行锁与表锁

### 13.1 行锁

锁定某一行数据。

优点：

- 并发高
- 影响范围小

### 13.2 表锁

锁整张表。

优点：

- 简单

缺点：

- 并发差
- 容易阻塞

InnoDB 更常见的是行锁，但前提通常是：

- SQL 能命中索引

如果没命中索引，可能退化成更大范围扫描，锁影响也会变大。

---

## 14. `SELECT ... FOR UPDATE`

这是后台开发里最常见的“先查再改”锁定方式。

例如：

```sql
START TRANSACTION;

SELECT *
FROM Users
WHERE id = 1
FOR UPDATE;

UPDATE Users
SET status = 'inactive'
WHERE id = 1;

COMMIT;
```

含义：

- 先把 `id = 1` 这条记录锁住
- 当前事务提交前，其他事务不能随便改这条数据

适用场景：

- 修改前必须先读取并确认状态
- 防止多人同时修改同一条记录

---

## 15. `LOCK IN SHARE MODE` / 共享读锁

部分 MySQL 版本可用：

```sql
SELECT *
FROM Users
WHERE id = 1
LOCK IN SHARE MODE;
```

它更偏向“读取时加共享锁”，但现在项目开发中更常用的是：

- 普通一致性读
- 或者 `FOR UPDATE`

---

## 16. InnoDB 为什么常说是“行锁”

InnoDB 并不是简单按“物理行”上锁，而是更偏向“索引记录上的锁”。

这意味着：

- 用索引精确查时，锁范围很小
- 不走索引时，可能锁影响会变大

例如：

```sql
SELECT * FROM Users WHERE id = 1 FOR UPDATE;
```

通常比：

```sql
SELECT * FROM Users WHERE username LIKE '%adm%' FOR UPDATE;
```

更安全也更高效。

---

## 17. 间隙锁与临键锁

这是 InnoDB 在 `REPEATABLE READ` 下防止幻读的重要机制。

### 17.1 间隙锁 Gap Lock

锁住索引记录之间的“间隙”，防止别的事务往中间插数据。

### 17.2 临键锁 Next-Key Lock

可以理解成：

- 记录锁
- 加上间隙锁

它常见于范围查询。

例如：

```sql
SELECT *
FROM Users
WHERE id BETWEEN 10 AND 20
FOR UPDATE;
```

这类 SQL 可能不只是锁住已有行，还会影响这个范围内的插入。

---

## 18. 锁等待是什么

当一个事务拿着锁没释放，另一个事务又想访问同样的数据，就会出现锁等待。

例如：

事务 A：

```sql
START TRANSACTION;
UPDATE Users SET status = 'inactive' WHERE id = 1;
```

事务 B：

```sql
UPDATE Users SET status = 'active' WHERE id = 1;
```

如果事务 A 没提交，事务 B 可能会一直等。

---

## 19. 什么是死锁

死锁是两个或多个事务互相等待对方释放锁，最终都走不下去。

### 19.1 经典死锁示例

事务 A：

```sql
START TRANSACTION;
UPDATE Users SET status = 'inactive' WHERE id = 1;
UPDATE Users SET status = 'inactive' WHERE id = 2;
```

事务 B：

```sql
START TRANSACTION;
UPDATE Users SET status = 'active' WHERE id = 2;
UPDATE Users SET status = 'active' WHERE id = 1;
```

如果时机刚好：

- A 先锁住 `id = 1`
- B 先锁住 `id = 2`
- A 再等 `id = 2`
- B 再等 `id = 1`

这就是死锁。

MySQL 通常会自动回滚其中一个事务。

---

## 20. 如何降低死锁概率

常用原则：

- 多条记录更新时，按固定顺序加锁
- 尽量让事务短小
- 尽量命中索引
- 不要在事务里做长时间业务逻辑
- 读和写分清楚
- 失败后允许重试

例如总是按 `id ASC` 顺序更新，就比“随手更新”更不容易死锁。

---

## 21. 后台管理中的事务实战

### 21.1 更新角色并重置菜单权限

```sql
START TRANSACTION;

UPDATE Roles
SET roleName = 'operator', description = '运维角色'
WHERE roleId = 5;

DELETE FROM RoleRoute
WHERE roleId = 5;

INSERT INTO RoleRoute (roleId, routeId)
VALUES
  (5, 64),
  (5, 65),
  (5, 66);

COMMIT;
```

这是标准后台授权更新事务。

---

### 21.2 删除菜单并清理中间关系

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

如果不用事务，删到一半失败，会留下脏数据。

---

### 21.3 修改用户角色并记录审计数据

如果你后续增加审计表：

```sql
START TRANSACTION;

UPDATE Users
SET roleId = 2
WHERE id = 10;

INSERT INTO UserAuditLog (userId, action, operatorId, createTime)
VALUES (10, 'change_role', 1, NOW());

COMMIT;
```

---

## 22. Node.js / Koa 项目中的事务思路

在这个项目里，一般做法是：

1. 拿数据库连接
2. `beginTransaction()`
3. 执行多个 SQL
4. 成功则 `commit()`
5. 失败则 `rollback()`
6. 最后释放连接

伪代码：

```js
const connection = await getConnection()

try {
  await connection.beginTransaction()

  await connection.execute('update Roles set roleName = ? where roleId = ?', ['editor', 3])
  await connection.execute('delete from RoleRoute where roleId = ?', [3])
  await connection.execute('insert into RoleRoute (roleId, routeId) values (?, ?), (?, ?)', [3, 64, 3, 65])

  await connection.commit()
} catch (error) {
  await connection.rollback()
  throw error
} finally {
  connection.release()
}
```

---

## 23. 什么操作不适合长事务

不建议在事务里做这些事：

- 调第三方接口
- 读文件/写文件
- 发消息通知
- 复杂计算
- 等用户输入

原因：

- 锁会持有更久
- 更容易阻塞别人
- 更容易引发死锁和超时

正确思路：

- 事务只包数据库核心修改
- 事务外做非数据库逻辑

---

## 24. 如何查看事务和锁问题

### 24.1 查看当前事务隔离级别

```sql
SELECT @@transaction_isolation;
```

### 24.2 查看锁等待相关信息

MySQL 8 常用：

```sql
SHOW ENGINE INNODB STATUS;
```

它对排查：

- 死锁
- 锁等待

非常有帮助。

### 24.3 查看正在执行的线程

```sql
SHOW PROCESSLIST;
```

---

## 25. 死锁后的处理建议

如果业务里偶发死锁，不代表数据库坏了。

更实用的处理方式是：

- 捕获死锁异常
- 记录日志
- 对幂等操作进行有限次数重试

常见策略：

- 重试 1 到 3 次
- 每次稍微 sleep 一下再试

---

## 26. 事务设计建议

### 26.1 一次事务只做一件完整业务

例如：

- “更新角色权限”是一件事
- “删除菜单并清理关联”是一件事

不要把多个不相关业务揉进一个大事务。

### 26.2 尽量先查后锁，再快速更新

例如：

```sql
START TRANSACTION;

SELECT * FROM Roles WHERE roleId = 3 FOR UPDATE;

UPDATE Roles SET roleName = 'editor' WHERE roleId = 3;

COMMIT;
```

### 26.3 保证索引合理

没有索引的锁，往往更危险。

---

## 27. 面向后台管理的锁实践建议

你的后台管理系统里，最可能需要重点考虑锁和事务的模块有：

- 角色管理
- 菜单管理
- 用户状态变更
- 权限分配
- 批量导入导出

这些模块常见特点：

- 多表更新
- 需要一致性
- 可能被多人同时操作

所以设计时应尽量：

- 用事务包裹核心写操作
- 用索引缩小锁范围
- 用固定顺序更新记录

---

## 28. 小结

事务解决的是：

- 多步操作的一致性

锁解决的是：

- 并发访问的数据安全

后台管理项目里最实用的经验通常是：

- 多表写操作用事务
- 精确更新尽量走主键或唯一索引
- 事务尽量短
- 更新顺序固定
- 出现死锁时允许安全重试

如果你还需要，我可以继续补一份：

- `MySQL 并发场景案例图解`
- `Koa 项目里事务封装最佳实践`
