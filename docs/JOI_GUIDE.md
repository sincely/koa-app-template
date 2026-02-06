# Joi 详细使用指南

> Joi 是一个强大的 JavaScript 数据验证库，支持复杂的 Schema 定义。

## 目录

- [1. 基础类型](#1-基础类型)
- [2. 字符串验证](#2-字符串验证)
- [3. 数字验证](#3-数字验证)
- [4. 对象验证](#4-对象验证)
- [5. 数组验证](#5-数组验证)
- [6. 可选与默认值](#6-可选与默认值)
- [7. 条件验证](#7-条件验证)
- [8. 自定义验证](#8-自定义验证)
- [9. 错误处理](#9-错误处理)
- [10. 项目实战](#10-项目实战)

---

## 1. 基础类型

```javascript
import Joi from 'joi'

// 字符串
const stringSchema = Joi.string()

// 数字
const numberSchema = Joi.number()

// 布尔值
const booleanSchema = Joi.boolean()

// 日期
const dateSchema = Joi.date()

// 任意类型
const anySchema = Joi.any()

// 二进制
const binarySchema = Joi.binary()

// 符号
const symbolSchema = Joi.symbol()
```

**使用示例：**

```javascript
// 验证
const result = Joi.string().validate('hello')
// { value: 'hello', error: undefined }

const result2 = Joi.string().validate(123)
// { value: 123, error: [ValidationError] }

// 快捷方式
const { error, value } = Joi.string().validate('hello')
if (error) {
  console.log(error.details[0].message)
}
```

---

## 2. 字符串验证

```javascript
// 基础
Joi.string()

// 非空
Joi.string().required()

// 长度限制
Joi.string().min(1)           // 最少1个字符
Joi.string().max(100)         // 最多100个字符
Joi.string().length(6)        // 必须6个字符

// 格式验证
Joi.string().email()          // 邮箱
Joi.string().uri()            // URL
Joi.string().uuid()           // UUID
Joi.string().ip()             // IP地址
Joi.string().domain()         // 域名
Joi.string().hostname()       // 主机名
Joi.string().isoDate()        // ISO日期格式
Joi.string().isoDuration()    // ISO时长格式
Joi.string().creditCard()     // 信用卡号

// 正则表达式
Joi.string().pattern(/^[a-zA-Z0-9]+$/)
Joi.string().regex(/^[a-zA-Z0-9]+$/)  // 同上

// 字母数字
Joi.string().alphanum()       // 只允许字母和数字

// 大小写
Joi.string().lowercase()      // 必须是小写
Joi.string().uppercase()      // 必须是大写

// 转换
Joi.string().trim()           // 去除首尾空格
Joi.string().lowercase()      // 转小写 (需配合 convert: true)
Joi.string().uppercase()      // 转大写

// 枚举
Joi.string().valid('active', 'inactive', 'deleted')

// 禁止值
Joi.string().invalid('admin', 'root')

// 组合示例
const usernameSchema = Joi.string()
  .min(3)
  .max(20)
  .pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)
  .required()
  .messages({
    'string.min': '用户名至少3个字符',
    'string.max': '用户名最多20个字符',
    'string.pattern.base': '用户名必须以字母开头',
    'any.required': '用户名不能为空'
  })
```

---

## 3. 数字验证

```javascript
// 基础
Joi.number()

// 整数
Joi.number().integer()

// 范围
Joi.number().min(0)           // 最小值
Joi.number().max(100)         // 最大值
Joi.number().greater(0)       // 大于
Joi.number().less(100)        // 小于
Joi.number().positive()       // 正数
Joi.number().negative()       // 负数

// 精度
Joi.number().precision(2)     // 最多2位小数

// 倍数
Joi.number().multiple(5)      // 必须是5的倍数

// 端口号
Joi.number().port()           // 0-65535

// 安全整数
Joi.number().unsafe(false)    // 禁止不安全整数

// 组合示例
const ageSchema = Joi.number()
  .integer()
  .min(0)
  .max(150)
  .required()
  .messages({
    'number.base': '年龄必须是数字',
    'number.integer': '年龄必须是整数',
    'number.min': '年龄不能小于0',
    'number.max': '年龄不能超过150'
  })

const priceSchema = Joi.number()
  .positive()
  .precision(2)
  .required()
```

---

## 4. 对象验证

### 4.1 基础对象

```javascript
const userSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required()
})

// 验证
const { error, value } = userSchema.validate({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})
```

### 4.2 嵌套对象

```javascript
const orderSchema = Joi.object({
  id: Joi.number().required(),
  user: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required()
  }).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.number().required(),
      quantity: Joi.number().integer().positive().required()
    })
  ).min(1).required()
})
```

### 4.3 未知键处理

```javascript
// 默认行为: 允许额外字段但不包含在结果中
const schema = Joi.object({ name: Joi.string() })

// 严格模式: 拒绝额外字段
const strictSchema = Joi.object({ name: Joi.string() }).unknown(false)

// 允许额外字段并保留
const looseSchema = Joi.object({ name: Joi.string() }).unknown(true)

// 使用 options
schema.validate(data, { allowUnknown: true })
schema.validate(data, { stripUnknown: true })
```

### 4.4 对象操作

```javascript
const userSchema = Joi.object({
  id: Joi.number(),
  name: Joi.string(),
  email: Joi.string(),
  password: Joi.string()
})

// 选取部分键
const publicSchema = userSchema.fork(['password'], (schema) => schema.forbidden())

// 合并对象
const addressSchema = Joi.object({
  city: Joi.string(),
  country: Joi.string()
})
const userWithAddress = userSchema.concat(addressSchema)

// 追加键
const extendedSchema = userSchema.append({
  role: Joi.string().valid('user', 'admin')
})

// 键重命名
const schema = Joi.object({
  user_name: Joi.string()
}).rename('user_name', 'username')
```

### 4.5 键依赖关系

```javascript
// and: 所有键必须同时存在或同时不存在
Joi.object({
  a: Joi.string(),
  b: Joi.string()
}).and('a', 'b')

// or: 至少一个键存在
Joi.object({
  email: Joi.string(),
  phone: Joi.string()
}).or('email', 'phone')

// xor: 只能有一个键存在
Joi.object({
  email: Joi.string(),
  phone: Joi.string()
}).xor('email', 'phone')

// with: 如果 a 存在，则 b 必须存在
Joi.object({
  password: Joi.string(),
  confirmPassword: Joi.string()
}).with('password', 'confirmPassword')

// without: 如果 a 存在，则 b 不能存在
Joi.object({
  email: Joi.string(),
  phone: Joi.string()
}).without('email', 'phone')

// nand: 不能同时存在
Joi.object({
  a: Joi.string(),
  b: Joi.string()
}).nand('a', 'b')

// oxor: 只能有0个或1个键存在
Joi.object({
  a: Joi.string(),
  b: Joi.string()
}).oxor('a', 'b')
```

---

## 5. 数组验证

```javascript
// 基础数组
Joi.array()

// 指定元素类型
Joi.array().items(Joi.string())
Joi.array().items(Joi.number())

// 多种类型
Joi.array().items(Joi.string(), Joi.number())

// 长度限制
Joi.array().min(1)            // 至少1个元素
Joi.array().max(10)           // 最多10个元素
Joi.array().length(5)         // 必须5个元素

// 唯一性
Joi.array().unique()          // 元素不能重复
Joi.array().unique('id')      // 根据id字段去重
Joi.array().unique((a, b) => a.id === b.id)  // 自定义比较

// 排序检查
Joi.array().sort({ order: 'ascending' })
Joi.array().sort({ order: 'descending' })

// 包含特定值
Joi.array().has(Joi.string().valid('admin'))  // 必须包含'admin'

// 组合示例
const tagsSchema = Joi.array()
  .items(Joi.string().min(1).max(20))
  .min(1)
  .max(10)
  .unique()
  .required()
  .messages({
    'array.min': '至少需要1个标签',
    'array.max': '最多10个标签',
    'array.unique': '标签不能重复'
  })
```

---

## 6. 可选与默认值

### 6.1 可选字段

```javascript
const schema = Joi.object({
  // 必填
  name: Joi.string().required(),

  // 可选 (不传或传undefined)
  email: Joi.string().optional(),

  // 允许null
  bio: Joi.string().allow(null),

  // 允许空字符串
  nickname: Joi.string().allow(''),

  // 允许null和空字符串
  description: Joi.string().allow(null, '')
})
```

### 6.2 默认值

```javascript
const schema = Joi.object({
  host: Joi.string().default('localhost'),
  port: Joi.number().default(3000),
  debug: Joi.boolean().default(false),
  tags: Joi.array().default([]),

  // 使用函数生成默认值
  createdAt: Joi.date().default(() => new Date(), 'current date')
})

schema.validate({})
// { host: 'localhost', port: 3000, debug: false, tags: [], createdAt: Date }
```

### 6.3 类型转换

```javascript
// 字符串转数字 (默认开启)
Joi.number().validate('42')
// { value: 42 }

// 字符串转布尔
Joi.boolean().truthy('yes', 'on', '1').falsy('no', 'off', '0')

// 字符串转日期
Joi.date().validate('2024-01-01')
// { value: Date }

// 禁用转换
Joi.number().validate('42', { convert: false })
// { error: [ValidationError] }
```

---

## 7. 条件验证

### 7.1 when 条件

```javascript
// 基于同级字段
const schema = Joi.object({
  type: Joi.string().valid('email', 'phone').required(),
  value: Joi.when('type', {
    is: 'email',
    then: Joi.string().email().required(),
    otherwise: Joi.string().pattern(/^\d{11}$/).required()
  })
})

// 多条件
const schema2 = Joi.object({
  role: Joi.string().valid('user', 'admin', 'guest'),
  permissions: Joi.when('role', {
    switch: [
      { is: 'admin', then: Joi.array().items(Joi.string()).required() },
      { is: 'user', then: Joi.array().items(Joi.string()).optional() },
      { is: 'guest', then: Joi.forbidden() }
    ]
  })
})

// 基于多个字段
const schema3 = Joi.object({
  isAdmin: Joi.boolean(),
  hasPermission: Joi.boolean(),
  action: Joi.when(Joi.object({ isAdmin: true, hasPermission: true }).unknown(), {
    then: Joi.string().valid('delete', 'edit', 'view'),
    otherwise: Joi.string().valid('view')
  })
})
```

### 7.2 alternatives

```javascript
// 多种可能的Schema
const schema = Joi.alternatives().try(
  Joi.string().email(),
  Joi.string().pattern(/^\d{11}$/)
)

// 条件选择
const schema2 = Joi.alternatives().conditional('type', {
  is: 'email',
  then: Joi.string().email(),
  otherwise: Joi.string().pattern(/^\d{11}$/)
})

// 匹配特定Schema
const schema3 = Joi.alternatives().match('all') // 必须匹配所有
const schema4 = Joi.alternatives().match('one')  // 只能匹配一个
const schema5 = Joi.alternatives().match('any')  // 匹配任意一个(默认)
```

---

## 8. 自定义验证

### 8.1 custom 方法

```javascript
// 自定义验证函数
const schema = Joi.string().custom((value, helpers) => {
  if (value.startsWith('admin_')) {
    return helpers.error('any.invalid')
  }
  return value  // 返回处理后的值
}, 'admin check')

// 带自定义错误消息
const schema2 = Joi.string().custom((value, helpers) => {
  if (!/[A-Z]/.test(value)) {
    return helpers.message({ custom: '必须包含大写字母' })
  }
  return value
})
```

### 8.2 extend 扩展

```javascript
// 扩展 Joi 添加自定义规则
const customJoi = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.phone': '{{#label}} 必须是有效的手机号'
  },
  rules: {
    phone: {
      validate(value, helpers) {
        if (!/^1[3-9]\d{9}$/.test(value)) {
          return helpers.error('string.phone')
        }
        return value
      }
    }
  }
}))

// 使用扩展规则
const phoneSchema = customJoi.string().phone()
```

### 8.3 external 异步验证

```javascript
const schema = Joi.string().email().external(async (value) => {
  const exists = await checkEmailInDatabase(value)
  if (exists) {
    throw new Error('邮箱已被注册')
  }
  return value
})

// 使用 validateAsync
await schema.validateAsync('test@example.com')
```

---

## 9. 错误处理

### 9.1 错误信息

```javascript
const schema = Joi.object({
  name: Joi.string().min(1).required(),
  age: Joi.number().min(0).required()
})

const { error, value } = schema.validate({ name: '', age: -1 })

if (error) {
  // 所有错误
  console.log(error.details)
  /*
  [
    { message: '"name" is not allowed to be empty', path: ['name'], type: 'string.empty' },
    { message: '"age" must be greater than or equal to 0', path: ['age'], type: 'number.min' }
  ]
  */

  // 第一个错误
  console.log(error.message)
  // "name" is not allowed to be empty

  // 格式化错误
  console.log(error.annotate())
}
```

### 9.2 自定义错误消息

```javascript
// 方式1: messages 方法
const schema = Joi.string()
  .min(3)
  .max(30)
  .required()
  .messages({
    'string.base': '用户名必须是字符串',
    'string.empty': '用户名不能为空',
    'string.min': '用户名至少{#limit}个字符',
    'string.max': '用户名最多{#limit}个字符',
    'any.required': '用户名为必填项'
  })

// 方式2: 使用 label
const schema2 = Joi.string()
  .min(3)
  .required()
  .label('用户名')
// "用户名" is required

// 方式3: 使用 prefs
const schema3 = Joi.string().min(3)
schema3.validate('ab', {
  messages: {
    'string.min': '太短了'
  }
})
```

### 9.3 abortEarly 选项

```javascript
// 默认: 遇到第一个错误就停止
schema.validate(data, { abortEarly: true })

// 收集所有错误
schema.validate(data, { abortEarly: false })
```

---

## 10. 项目实战

### 10.1 用户模块 Schema

```javascript
// src/validators/usersValidator.js
import Joi from 'joi'

// 用户名规则
const usernameRule = Joi.string()
  .pattern(/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/)
  .required()
  .messages({
    'string.pattern.base': '用户名必须以字母开头，3-20位字母数字下划线',
    'string.empty': '用户名不能为空',
    'any.required': '用户名不能为空'
  })

// 密码规则
const passwordRule = Joi.string()
  .min(6)
  .max(50)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .required()
  .messages({
    'string.min': '密码至少6位',
    'string.max': '密码最多50位',
    'string.pattern.base': '密码必须包含大小写字母和数字',
    'any.required': '密码不能为空'
  })

// 登录 Schema
export const loginSchema = Joi.object({
  username: usernameRule,
  password: Joi.string().min(1).required().messages({
    'string.empty': '密码不能为空',
    'any.required': '密码不能为空'
  })
})

// 注册 Schema
export const registerSchema = Joi.object({
  username: usernameRule,
  password: passwordRule,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': '两次密码不一致',
      'any.required': '请确认密码'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': '邮箱格式不正确'
    })
})

// 更新用户 Schema
export const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(50).optional(),
  email: Joi.string().email().optional(),
  avatar: Joi.string().uri().optional(),
  bio: Joi.string().max(500).allow('').optional()
}).min(1).messages({
  'object.min': '至少需要更新一个字段'
})

// 分页查询 Schema
export const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  keyword: Joi.string().allow('').optional(),
  status: Joi.string().valid('active', 'inactive', 'deleted').optional(),
  role: Joi.string().valid('user', 'admin').optional(),
  sortBy: Joi.string().valid('createdAt', 'name').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
})
```

### 10.2 验证工具函数

```javascript
// src/utils/validateParams.js
import Joi from 'joi'
import { BUSINESS_CODE } from '../config/businessCode.js'

/**
 * 参数校验工具函数
 * @param {Object} schema - Joi schema 对象
 * @param {Object} data - 待校验的数据
 * @returns {Object|null} - 校验通过返回null，失败返回错误对象
 */
export const validateParams = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,  // 收集所有错误
    stripUnknown: true  // 移除未知字段
  })

  if (error) {
    return {
      code: BUSINESS_CODE.PARAM_ERROR,
      msg: error.details[0].message,
      errors: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    }
  }

  return null
}

export { Joi }
```

### 10.3 Controller 中使用

```javascript
// src/controllers/users/userController.js
import { validateParams } from '../../utils/validateParams.js'
import { loginSchema, registerSchema } from '../../validators/usersValidator.js'

const login = async (ctx) => {
  const { username, password } = ctx.request.body

  // 校验参数
  const error = validateParams(loginSchema, { username, password })
  if (error) {
    ctx.status = 200
    ctx.body = error
    return
  }

  // 业务逻辑...
}

const register = async (ctx) => {
  const data = ctx.request.body

  const error = validateParams(registerSchema, data)
  if (error) {
    ctx.status = 200
    ctx.body = error
    return
  }

  // 业务逻辑...
}
```

### 10.4 中间件方式

```javascript
// src/middleware/joiValidation.js
import { BUSINESS_CODE } from '../config/businessCode.js'

export const validateBody = (schema) => async (ctx, next) => {
  const { error, value } = schema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true
  })

  if (error) {
    ctx.status = 400
    ctx.body = {
      code: BUSINESS_CODE.PARAM_ERROR,
      msg: error.details[0].message
    }
    return
  }

  ctx.request.body = value
  await next()
}

export const validateQuery = (schema) => async (ctx, next) => {
  const { error, value } = schema.validate(ctx.query, {
    abortEarly: false,
    stripUnknown: true
  })

  if (error) {
    ctx.status = 400
    ctx.body = {
      code: BUSINESS_CODE.PARAM_ERROR,
      msg: error.details[0].message
    }
    return
  }

  ctx.query = value
  await next()
}
```

---

## 参考链接

- [Joi 官方文档](https://joi.dev/)
- [Joi GitHub](https://github.com/hapijs/joi)
