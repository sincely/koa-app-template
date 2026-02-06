# Knex.js 详细使用指南

> 本项目使用 Knex.js 作为 SQL 查询构建器，提供类型安全的数据库操作。

## 目录

- [1. 基础配置](#1-基础配置)
- [2. 单表 CRUD 操作](#2-单表-crud-操作)
- [3. 条件查询](#3-条件查询)
- [4. 多表联合查询](#4-多表联合查询)
- [5. 事务处理](#5-事务处理)
- [6. 原生 SQL](#6-原生-sql)
- [7. 实战示例](#7-实战示例)

---

## 1. 基础配置

### 引入数据库连接

```javascript
import { db } from '../config/knex.js'
```

### 配置文件 (`src/config/knex.js`)

```javascript
import knex from 'knex'
import { dbConfig } from './setting.js'

const setup = {
  client: 'mysql2',
  connection: {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port || 3306
  },
  pool: {
    min: 2,
    max: 10
  }
}

export const db = knex(setup)
```

---

## 2. 单表 CRUD 操作

### 2.1 查询 (Read)

```javascript
// 查询所有
const users = await db('users').select('*')

// 查询指定字段
const users = await db('users').select('id', 'username', 'email')

// 查询单条 (返回对象或 undefined)
const user = await db('users').where({ id: 1 }).first()

// 查询单条指定字段
const user = await db('users').select('id', 'username').where({ id: 1 }).first()

// 统计数量
const [{ count }] = await db('users').count('id as count')

// 去重查询
const roles = await db('users').distinct('role')
```

### 2.2 插入 (Create)

```javascript
// 插入单条 (返回插入的 ID 数组)
const [id] = await db('users').insert({
  username: 'john',
  email: 'john@example.com',
  password: 'hashed_password'
})

// 插入多条
const ids = await db('users').insert([
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' }
])

// 插入并返回完整记录 (MySQL 不支持 returning，需要二次查询)
const [id] = await db('users').insert({ username: 'john' })
const user = await db('users').where({ id }).first()

// 插入或忽略 (存在则跳过)
await db('users').insert({ username: 'john' }).onConflict('username').ignore()

// 插入或更新 (upsert)
await db('users')
  .insert({ username: 'john', email: 'new@example.com' })
  .onConflict('username')
  .merge()
```

### 2.3 更新 (Update)

```javascript
// 更新单条
await db('users')
  .where({ id: 1 })
  .update({ email: 'new@example.com' })

// 更新多个字段
await db('users')
  .where({ id: 1 })
  .update({
    username: 'new_name',
    updated_at: db.fn.now()
  })

// 批量更新
await db('users')
  .where('role', 'guest')
  .update({ role: 'user' })

// 自增/自减
await db('articles')
  .where({ id: 1 })
  .increment('view_count', 1)

await db('products')
  .where({ id: 1 })
  .decrement('stock', 5)
```

### 2.4 删除 (Delete)

```javascript
// 删除单条
await db('users').where({ id: 1 }).del()

// 批量删除
await db('users').where('status', 'inactive').del()

// 清空表 (谨慎使用!)
await db('logs').truncate()
```

---

## 3. 条件查询

### 3.1 基础条件

```javascript
// 相等
await db('users').where({ status: 'active' })
await db('users').where('status', 'active')

// 不等于
await db('users').whereNot({ status: 'deleted' })
await db('users').where('status', '!=', 'deleted')
await db('users').where('status', '<>', 'deleted')

// 比较运算符
await db('users').where('age', '>', 18)
await db('users').where('age', '>=', 18)
await db('users').where('age', '<', 60)
await db('users').where('created_at', '<=', '2024-01-01')
```

### 3.2 多条件组合

```javascript
// AND 条件
await db('users')
  .where({ status: 'active' })
  .andWhere('age', '>', 18)

// OR 条件
await db('users')
  .where({ role: 'admin' })
  .orWhere({ role: 'super_admin' })

// 复杂条件组合
await db('users').where((builder) => {
  builder
    .where({ status: 'active' })
    .andWhere((sub) => {
      sub.where('role', 'admin').orWhere('age', '>', 30)
    })
})
// SQL: WHERE status = 'active' AND (role = 'admin' OR age > 30)
```

### 3.3 范围查询

```javascript
// IN 查询
await db('users').whereIn('id', [1, 2, 3])
await db('users').whereNotIn('status', ['deleted', 'banned'])

// BETWEEN 查询
await db('orders').whereBetween('amount', [100, 500])
await db('users').whereNotBetween('age', [18, 25])

// NULL 查询
await db('users').whereNull('deleted_at')
await db('users').whereNotNull('email')
```

### 3.4 模糊查询

```javascript
// LIKE 查询
await db('users').where('username', 'like', '%john%')
await db('users').where('email', 'like', '%@gmail.com')

// 使用 whereLike (Knex 0.95+)
await db('users').whereLike('username', '%john%')
await db('users').whereILike('username', '%JOHN%') // 不区分大小写
```

### 3.5 排序与分页

```javascript
// 排序
await db('users').orderBy('created_at', 'desc')
await db('users').orderBy([
  { column: 'role', order: 'asc' },
  { column: 'created_at', order: 'desc' }
])

// 分页
const page = 1
const pageSize = 10
await db('users')
  .select('*')
  .limit(pageSize)
  .offset((page - 1) * pageSize)

// 获取总数 + 分页数据
const [{ total }] = await db('users').count('id as total')
const list = await db('users').limit(10).offset(0)
```

### 3.6 分组与聚合

```javascript
// 分组统计
await db('orders')
  .select('user_id')
  .count('id as order_count')
  .sum('amount as total_amount')
  .groupBy('user_id')

// HAVING 子句
await db('orders')
  .select('user_id')
  .count('id as order_count')
  .groupBy('user_id')
  .having('order_count', '>', 5)
```

---

## 4. 多表联合查询

### 4.1 INNER JOIN

```javascript
// 基础 JOIN
const orders = await db('orders')
  .join('users', 'orders.user_id', 'users.id')
  .select('orders.*', 'users.username')

// 多表 JOIN
const data = await db('orders')
  .join('users', 'orders.user_id', 'users.id')
  .join('products', 'orders.product_id', 'products.id')
  .select(
    'orders.id',
    'orders.amount',
    'users.username',
    'products.name as product_name'
  )
```

### 4.2 LEFT JOIN / RIGHT JOIN

```javascript
// LEFT JOIN (保留左表所有记录)
const users = await db('users')
  .leftJoin('orders', 'users.id', 'orders.user_id')
  .select('users.*', db.raw('COUNT(orders.id) as order_count'))
  .groupBy('users.id')

// RIGHT JOIN
const orders = await db('orders')
  .rightJoin('users', 'orders.user_id', 'users.id')
  .select('*')
```

### 4.3 复杂 JOIN 条件

```javascript
// 多条件 JOIN
const data = await db('orders')
  .join('products', (join) => {
    join
      .on('orders.product_id', '=', 'products.id')
      .andOn('products.status', '=', db.raw('?', ['active']))
  })
  .select('*')

// 子查询 JOIN
const subquery = db('orders')
  .select('user_id')
  .sum('amount as total')
  .groupBy('user_id')
  .as('order_totals')

const users = await db('users')
  .leftJoin(subquery, 'users.id', 'order_totals.user_id')
  .select('users.*', 'order_totals.total')
```

### 4.4 UNION 查询

```javascript
// UNION (去重)
const result = await db('admins')
  .select('id', 'name', db.raw("'admin' as type"))
  .union([
    db('users').select('id', 'name', db.raw("'user' as type"))
  ])

// UNION ALL (保留重复)
const result = await db('table1')
  .select('*')
  .unionAll([
    db('table2').select('*')
  ])
```

---

## 5. 事务处理

### 5.1 基础事务

```javascript
// 使用 transaction 方法
await db.transaction(async (trx) => {
  // 所有操作使用 trx 而非 db
  const [orderId] = await trx('orders').insert({
    user_id: 1,
    amount: 100
  })

  await trx('products')
    .where({ id: productId })
    .decrement('stock', 1)

  await trx('order_items').insert({
    order_id: orderId,
    product_id: productId,
    quantity: 1
  })

  // 如果所有操作成功，事务自动提交
  // 如果任何操作抛出错误，事务自动回滚
})
```

### 5.2 手动控制事务

```javascript
const trx = await db.transaction()

try {
  await trx('accounts')
    .where({ id: fromId })
    .decrement('balance', amount)

  await trx('accounts')
    .where({ id: toId })
    .increment('balance', amount)

  await trx('transfers').insert({
    from_id: fromId,
    to_id: toId,
    amount
  })

  // 手动提交
  await trx.commit()
} catch (error) {
  // 手动回滚
  await trx.rollback()
  throw error
}
```

### 5.3 嵌套事务 (Savepoints)

```javascript
await db.transaction(async (trx) => {
  await trx('users').insert({ name: 'User 1' })

  try {
    await trx.transaction(async (trx2) => {
      await trx2('users').insert({ name: 'User 2' })
      throw new Error('Rollback nested only')
    })
  } catch (e) {
    // 内层事务回滚，外层继续
    console.log('Inner transaction rolled back')
  }

  await trx('users').insert({ name: 'User 3' })
  // User 1 和 User 3 会被插入，User 2 不会
})
```

### 5.4 事务隔离级别

```javascript
await db.transaction(
  async (trx) => {
    // 事务操作
  },
  {
    isolationLevel: 'serializable' // 或 'read committed', 'repeatable read'
  }
)
```

---

## 6. 原生 SQL

### 6.1 原生查询

```javascript
// 完整原生 SQL
const users = await db.raw('SELECT * FROM users WHERE age > ?', [18])

// 在查询中使用原生表达式
await db('users')
  .select('*', db.raw('YEAR(created_at) as year'))
  .where(db.raw('DATEDIFF(NOW(), last_login) > 30'))

// 原生 WHERE 条件
await db('users').whereRaw('age > ? AND status = ?', [18, 'active'])
```

### 6.2 原生函数

```javascript
// 当前时间
await db('users').insert({
  name: 'John',
  created_at: db.fn.now()
})

// 聚合函数
const result = await db('orders')
  .select(
    db.raw('DATE(created_at) as date'),
    db.raw('SUM(amount) as daily_total'),
    db.raw('AVG(amount) as avg_amount')
  )
  .groupBy(db.raw('DATE(created_at)'))
```

---

## 7. 实战示例

### 7.1 用户 DAO 完整示例

```javascript
// src/models/dao/usersDao.js
import { db } from '../../config/knex.js'
import { hashPassword, comparePassword } from '../../utils/password.js'

/**
 * 用户登录
 */
const login = async (username, password) => {
  const user = await db('users')
    .where((builder) => {
      builder.where({ username }).orWhere({ email: username })
    })
    .first()

  if (!user) {
    return null
  }

  const isMatch = await comparePassword(password, user.password)
  return isMatch ? user : null
}

/**
 * 创建用户
 */
const create = async (userData) => {
  const hashedPassword = await hashPassword(userData.password)

  const [id] = await db('users').insert({
    ...userData,
    password: hashedPassword,
    created_at: db.fn.now()
  })

  return db('users').where({ id }).first()
}

/**
 * 分页查询用户
 */
const findAll = async ({ page = 1, pageSize = 10, status, keyword }) => {
  let query = db('users').select('id', 'username', 'email', 'status', 'created_at')

  if (status) {
    query = query.where({ status })
  }

  if (keyword) {
    query = query.where((builder) => {
      builder
        .where('username', 'like', `%${keyword}%`)
        .orWhere('email', 'like', `%${keyword}%`)
    })
  }

  const [{ total }] = await query.clone().count('id as total')

  const list = await query
    .orderBy('created_at', 'desc')
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return {
    list,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }
}

export default { login, create, findAll }
```

### 7.2 订单创建 (带事务)

```javascript
// src/models/dao/ordersDao.js
import { db } from '../../config/knex.js'

/**
 * 创建订单 (事务)
 */
const createOrder = async (userId, items) => {
  return db.transaction(async (trx) => {
    // 1. 计算总金额
    const productIds = items.map((item) => item.productId)
    const products = await trx('products').whereIn('id', productIds)

    let totalAmount = 0
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        throw new Error(`商品不存在: ${item.productId}`)
      }
      if (product.stock < item.quantity) {
        throw new Error(`库存不足: ${product.name}`)
      }
      totalAmount += product.price * item.quantity
    }

    // 2. 创建订单
    const [orderId] = await trx('orders').insert({
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      created_at: trx.fn.now()
    })

    // 3. 创建订单明细 + 扣减库存
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)

      await trx('order_items').insert({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: product.price
      })

      await trx('products')
        .where({ id: item.productId })
        .decrement('stock', item.quantity)
    }

    // 4. 返回完整订单
    return trx('orders')
      .join('order_items', 'orders.id', 'order_items.order_id')
      .join('products', 'order_items.product_id', 'products.id')
      .where('orders.id', orderId)
      .select(
        'orders.*',
        'order_items.quantity',
        'order_items.price',
        'products.name as product_name'
      )
  })
}

export default { createOrder }
```

---

## 参考链接

- [Knex.js 官方文档](https://knexjs.org/)
- [Knex.js GitHub](https://github.com/knex/knex)
