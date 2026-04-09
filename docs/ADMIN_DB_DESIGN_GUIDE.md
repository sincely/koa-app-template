# 后台管理数据库设计规范

这份文档面向后台管理系统开发，重点讲：

- 表怎么命名
- 字段怎么设计
- 主键、外键、索引怎么选
- 用户、角色、菜单、权限这类后台核心表怎么拆
- 怎样让数据库结构更适合长期维护

这份规范适合你当前项目，也适合后续继续扩展：

- 用户管理
- 角色管理
- 菜单管理
- 按钮权限
- 部门管理
- 字典管理
- 日志与审计

---

## 1. 设计目标

后台管理数据库设计的核心目标通常有 4 个：

- 结构清晰
- 扩展方便
- 查询高效
- 维护成本低

不要为了“理论上很标准”把表设计得过度复杂，也不要为了“开发快”把所有信息都揉到一张表里。

---

## 2. 后台管理常见核心实体

一个典型后台系统，至少会有这些核心实体：

- 用户 `user`
- 角色 `role`
- 菜单 `menu`
- 按钮权限 `button_permission`
- 用户与角色关系
- 角色与菜单关系
- 角色与按钮关系
- 操作日志
- 登录日志

你当前项目已经具备这些核心方向：

- `Users`
- `Roles`
- `RouteAuth`
- `RoleRoute`
- `ButtonAuth`

后续可以在现有结构上继续规范化。

---

## 3. 命名规范

### 3.1 表名规范

推荐：

- 统一风格
- 含义明确
- 不混用大小写

建议优先使用：

- 小写
- 下划线命名
- 单数或复数保持统一

推荐风格：

```sql
admin_user
admin_role
admin_menu
admin_role_menu
admin_role_button
admin_login_log
admin_operation_log
```

不太推荐：

```sql
Users
Roles
RouteAuth
RoleRoute
```

原因：

- 大小写风格不统一
- 语义有时偏技术实现，不够业务化

如果当前项目要兼容已有库，可以先继续使用现有表，但新模块尽量统一命名规则。

---

### 3.2 字段名规范

推荐全部使用：

- 小写
- 下划线命名

例如：

```sql
user_id
role_id
menu_id
created_at
updated_at
created_by
updated_by
is_deleted
```

不太推荐混用：

```sql
createTime
roleId
parent_id
```

统一风格能大幅降低维护成本。

---

## 4. 主键设计规范

### 4.1 推荐使用单一主键

最常见方式：

```sql
id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY
```

优点：

- 简单
- 高效
- 易于关联

### 4.2 是否使用 UUID

如果没有分布式场景要求，后台管理系统通常优先：

- 自增 ID

如果后续要跨服务或前端直接暴露 ID 且不想暴露增长规律，可以再考虑：

- UUID
- 雪花 ID

---

## 5. 通用字段设计

后台管理里的很多表，建议统一保留这些字段：

```sql
id
created_at
updated_at
created_by
updated_by
is_deleted
remark
```

说明：

- `created_at`：创建时间
- `updated_at`：更新时间
- `created_by`：创建人
- `updated_by`：最后修改人
- `is_deleted`：逻辑删除标记
- `remark`：备注说明

示例：

```sql
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
created_by BIGINT DEFAULT NULL,
updated_by BIGINT DEFAULT NULL,
is_deleted TINYINT(1) NOT NULL DEFAULT 0,
remark VARCHAR(255) DEFAULT NULL
```

---

## 6. 时间字段规范

推荐统一使用：

- `created_at`
- `updated_at`

如果有删除审计：

- `deleted_at`

示例：

```sql
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

尽量不要一个项目里同时出现：

- `createTime`
- `createdAt`
- `created_time`

---

## 7. 状态字段设计

很多后台表都会有状态。

推荐方式：

### 7.1 方案一：枚举型业务值

```sql
status VARCHAR(20) NOT NULL DEFAULT 'active'
```

优点：

- 可读性强

### 7.2 方案二：数字状态码

```sql
status TINYINT NOT NULL DEFAULT 1
```

例如：

- `1` 启用
- `0` 禁用
- `2` 冻结

建议：

- 如果团队更关注 SQL 可读性，用字符串
- 如果更关注存储和统一规范，用数字码值

后台管理里常见做法是：

- 数据库存数字
- 应用层维护枚举映射

---

## 8. 是否使用逻辑删除

### 8.1 逻辑删除

```sql
is_deleted TINYINT(1) NOT NULL DEFAULT 0
```

删除时：

```sql
UPDATE admin_user
SET is_deleted = 1
WHERE id = 10;
```

优点：

- 数据可恢复
- 有利于审计

缺点：

- 查询时要记得带 `is_deleted = 0`

### 8.2 物理删除

```sql
DELETE FROM admin_user WHERE id = 10;
```

适合：

- 纯中间表
- 临时数据
- 明确不需要保留历史的数据

建议：

- 业务主表优先逻辑删除
- 中间表可以物理删除

---

## 9. 用户表设计规范

一个后台用户表，建议至少包含：

```sql
id
username
password
nickname
real_name
email
phone
avatar
status
last_login_at
created_at
updated_at
is_deleted
remark
```

推荐示例：

```sql
CREATE TABLE admin_user (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) DEFAULT NULL,
  real_name VARCHAR(50) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  last_login_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  remark VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_user_username (username),
  UNIQUE KEY uk_admin_user_email (email)
);
```

说明：

- 登录用户名必须唯一
- 密码必须存哈希，不能存明文

---

## 10. 角色表设计规范

角色表建议字段：

```sql
id
role_code
role_name
status
created_at
updated_at
remark
```

推荐示例：

```sql
CREATE TABLE admin_role (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role_code VARCHAR(50) NOT NULL,
  role_name VARCHAR(50) NOT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  remark VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_role_code (role_code),
  UNIQUE KEY uk_admin_role_name (role_name)
);
```

建议：

- `role_code` 用于程序判断，例如 `super_admin`
- `role_name` 用于展示，例如 “超级管理员”

---

## 11. 菜单表设计规范

菜单表建议字段：

```sql
id
parent_id
menu_type
path
name
component
permission_code
icon
sort
visible
status
created_at
updated_at
remark
```

推荐示例：

```sql
CREATE TABLE admin_menu (
  id BIGINT NOT NULL AUTO_INCREMENT,
  parent_id BIGINT DEFAULT 0,
  menu_type TINYINT NOT NULL,
  path VARCHAR(255) DEFAULT NULL,
  name VARCHAR(100) NOT NULL,
  component VARCHAR(255) DEFAULT NULL,
  permission_code VARCHAR(100) DEFAULT NULL,
  icon VARCHAR(100) DEFAULT NULL,
  sort INT NOT NULL DEFAULT 0,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  status TINYINT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  remark VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_admin_menu_parent_id (parent_id),
  KEY idx_admin_menu_sort (sort),
  UNIQUE KEY uk_admin_menu_path (path)
);
```

---

## 12. 菜单类型建议

后台菜单通常不止一种类型，建议用 `menu_type` 区分：

- `1` 目录
- `2` 菜单
- `3` 按钮

这样有利于：

- 前端动态菜单生成
- 后端权限码控制
- 一个权限模型支持菜单和按钮

如果你已经拆成：

- 菜单表
- 按钮表

也可以继续沿用，但新设计里通常统一到权限资源表更灵活。

---

## 13. 用户角色关系设计

### 13.1 一个用户只允许一个角色

可以直接把 `role_id` 放用户表里：

```sql
role_id BIGINT DEFAULT NULL
```

优点：

- 简单
- 查询快

缺点：

- 不支持一个用户多个角色

### 13.2 一个用户可以有多个角色

推荐建立中间表：

```sql
CREATE TABLE admin_user_role (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_user_role (user_id, role_id),
  KEY idx_admin_user_role_role_id (role_id)
);
```

后台管理系统更推荐多角色模型，因为扩展性更强。

---

## 14. 角色菜单关系设计

推荐中间表：

```sql
CREATE TABLE admin_role_menu (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  menu_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_role_menu (role_id, menu_id),
  KEY idx_admin_role_menu_menu_id (menu_id)
);
```

优点：

- 清晰表达多对多关系
- 更新授权时很方便

---

## 15. 按钮权限设计

按钮权限有两种常见设计方式。

### 15.1 设计成独立表

```sql
button_permission
```

优点：

- 结构清楚

### 15.2 设计成菜单表中的一种类型

即 `menu_type = 3`

优点：

- 权限资源统一
- 查询授权更一致

后台系统长期看，统一资源模型通常更利于扩展。

---

## 16. 审计与日志表设计

后台管理通常建议至少有两类日志表：

### 16.1 登录日志

建议字段：

```sql
id
user_id
username
ip
user_agent
login_status
login_time
fail_reason
```

### 16.2 操作日志

建议字段：

```sql
id
operator_id
operator_name
module
action
request_method
request_path
request_params
response_data
ip
create_time
```

这样后续出问题时很容易追踪。

---

## 17. 字典表设计

后台管理中常见的状态、类型、分类，建议用字典表统一维护。

示例：

```sql
CREATE TABLE sys_dict_type (
  id BIGINT NOT NULL AUTO_INCREMENT,
  dict_code VARCHAR(50) NOT NULL,
  dict_name VARCHAR(100) NOT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sys_dict_type_code (dict_code)
);
```

```sql
CREATE TABLE sys_dict_item (
  id BIGINT NOT NULL AUTO_INCREMENT,
  dict_type_id BIGINT NOT NULL,
  item_label VARCHAR(100) NOT NULL,
  item_value VARCHAR(100) NOT NULL,
  sort INT NOT NULL DEFAULT 0,
  status TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_sys_dict_item_type_id (dict_type_id)
);
```

---

## 18. 索引设计规范

每张后台业务表至少考虑这些索引：

### 18.1 唯一字段

- 用户名
- 邮箱
- 角色编码
- 菜单路径

### 18.2 高频查询字段

- 状态
- 角色 ID
- 父级 ID
- 创建时间

### 18.3 中间表必须有联合唯一索引

例如：

```sql
UNIQUE KEY uk_admin_role_menu (role_id, menu_id)
```

这样可以避免重复绑定。

---

## 19. 外键是否一定要加

这是一个很实际的问题。

### 19.1 加外键的优点

- 数据一致性更强
- 结构表达更明确

### 19.2 加外键的缺点

- 批量写入和迁移更麻烦
- 删除更新受限制
- 在复杂项目里可能增加维护成本

很多中大型后台项目会采用：

- 逻辑外键
- 不在数据库层强制加外键
- 在应用层保证数据关系正确

建议：

- 小项目、学习项目：可以加外键帮助理解
- 复杂后台项目：可以只保留索引和逻辑约束

---

## 20. 是否拆库拆表

一般后台管理系统早期通常不需要拆库拆表。

建议顺序：

1. 先把结构设计清楚
2. 再把索引设计合理
3. 再做 SQL 优化
4. 真有性能瓶颈再考虑拆分

不要一开始就为了“未来可能上亿数据”把结构设计得很重。

---

## 21. 后台管理库推荐分层

可以按业务域划分：

- 用户域
- 权限域
- 系统域
- 审计域

示意：

- `admin_user`
- `admin_role`
- `admin_menu`
- `admin_role_menu`
- `admin_operation_log`
- `admin_login_log`
- `sys_dict_type`
- `sys_dict_item`

这样命名更容易维护。

---

## 22. 推荐的后台权限模型

推荐模型：

- 用户
- 角色
- 权限资源
- 用户角色中间表
- 角色权限中间表

即：

```text
user -> user_role -> role -> role_permission -> permission
```

权限资源 `permission` 可以统一包含：

- 目录
- 菜单
- 按钮
- 接口权限码

这是比单纯“菜单表 + 按钮表”更统一的方式。

---

## 23. 当前项目可演进方向

你当前项目已有：

- `Users`
- `Roles`
- `RouteAuth`
- `RoleRoute`
- `ButtonAuth`

如果继续迭代，建议这样逐步规范化：

### 23.1 短期

- 保持现有表可用
- 统一新增字段风格
- 把新表命名规范化

### 23.2 中期

- 把 `Users` / `Roles` / `RouteAuth` 逐步迁移为统一小写下划线风格
- 增加审计字段
- 引入逻辑删除字段

### 23.3 长期

- 用户角色改成多对多
- 菜单和按钮统一成权限资源表
- 增加操作日志、登录日志、字典表、部门表

---

## 24. 推荐字段模板

### 24.1 业务主表模板

```sql
id BIGINT NOT NULL AUTO_INCREMENT,
status TINYINT NOT NULL DEFAULT 1,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
created_by BIGINT DEFAULT NULL,
updated_by BIGINT DEFAULT NULL,
is_deleted TINYINT(1) NOT NULL DEFAULT 0,
remark VARCHAR(255) DEFAULT NULL
```

### 24.2 中间关系表模板

```sql
id BIGINT NOT NULL AUTO_INCREMENT,
left_id BIGINT NOT NULL,
right_id BIGINT NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
UNIQUE KEY uk_left_right (left_id, right_id)
```

### 24.3 日志表模板

```sql
id BIGINT NOT NULL AUTO_INCREMENT,
operator_id BIGINT DEFAULT NULL,
module VARCHAR(100) NOT NULL,
action VARCHAR(100) NOT NULL,
content JSON DEFAULT NULL,
ip VARCHAR(64) DEFAULT NULL,
user_agent VARCHAR(255) DEFAULT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id)
```

---

## 25. 设计时常见错误

### 25.1 所有字段都允许为空

问题：

- 数据质量差
- 后续校验困难

### 25.2 没有唯一约束

例如：

- 用户名不唯一
- 角色名不唯一

### 25.3 一个字段承载多种含义

例如：

- 一个 `type` 字段同时表示分类、状态、来源

### 25.4 直接存逗号拼接 ID

不推荐：

```sql
menu_ids = '1,2,3,4'
```

推荐：

- 用中间表

### 25.5 完全不留审计字段

问题：

- 后期定位“谁改了什么”非常困难

---

## 26. 一个推荐的后台权限库简化模型

### 26.1 用户表

```sql
admin_user
```

### 26.2 角色表

```sql
admin_role
```

### 26.3 权限资源表

```sql
admin_permission
```

### 26.4 用户角色关系表

```sql
admin_user_role
```

### 26.5 角色权限关系表

```sql
admin_role_permission
```

这个模型的优势是：

- 足够通用
- 支持菜单和按钮统一控制
- 支持一个用户多个角色

---

## 27. 如何落地到当前项目

如果你现在不想大改现有表结构，可以先这样做：

- 保留现有 `Users`
- 保留现有 `Roles`
- 保留现有 `RouteAuth`
- 保留现有 `RoleRoute`
- 保留现有 `ButtonAuth`

然后在新功能里逐步引入规范：

- 新增统一审计字段
- 新增唯一索引
- 新增逻辑删除
- 新增日志表

这是最现实的演进路线。

---

## 28. 小结

后台管理数据库设计的重点，不是“表越多越高级”，而是：

- 命名统一
- 关系清晰
- 约束合理
- 索引匹配查询场景
- 后续扩展方便

你做后台管理时，最值得优先规范的通常是：

- 用户表
- 角色表
- 菜单/权限表
- 中间关系表
- 审计日志表

如果你愿意，我下一步可以继续给你补：

- `后台管理表结构 SQL 初始化模板`
- `RBAC 权限模型设计图`
- `用户、角色、菜单、按钮四张表的完整建表 SQL`
