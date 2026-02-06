# Zod 详细使用指南

> Zod 是一个 TypeScript-first 的数据验证库，本项目用于 API 请求参数校验。

## 目录

- [1. 基础类型](#1-基础类型)
- [2. 对象与嵌套](#2-对象与嵌套)
- [3. 数组与元组](#3-数组与元组)
- [4. 字符串验证](#4-字符串验证)
- [5. 数字验证](#5-数字验证)
- [6. 可选与默认值](#6-可选与默认值)
- [7. 枚举与联合类型](#7-枚举与联合类型)
- [8. 数据转换](#8-数据转换)
- [9. 自定义验证](#9-自定义验证)
- [10. 错误处理](#10-错误处理)
- [11. 项目实战](#11-项目实战)

---

## 1. 基础类型

```javascript
import { z } from 'zod'

// 字符串
const stringSchema = z.string()

// 数字
const numberSchema = z.number()

// 布尔值
const booleanSchema = z.boolean()

// 日期
const dateSchema = z.date()

// BigInt
const bigintSchema = z.bigint()

// 任意类型
const anySchema = z.any()

// 未知类型 (比 any 更安全)
const unknownSchema = z.unknown()

// 空值
const nullSchema = z.null()
const undefinedSchema = z.undefined()
const voidSchema = z.void()

// 字面量
const literalSchema = z.literal('active')
const numberLiteral = z.literal(42)
```

**使用示例：**

```javascript
// 验证
stringSchema.parse('hello')      // ✅ 返回 'hello'
stringSchema.parse(123)          // ❌ 抛出 ZodError

// 安全验证 (不抛出错误)
const result = stringSchema.safeParse('hello')
// { success: true, data: 'hello' }

const result2 = stringSchema.safeParse(123)
// { success: false, error: ZodError }
```

---

## 2. 对象与嵌套

### 2.1 基础对象

```javascript
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
})

// 验证
UserSchema.parse({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})
```

### 2.2 嵌套对象

```javascript
const OrderSchema = z.object({
  id: z.number(),
  user: z.object({
    id: z.number(),
    name: z.string()
  }),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().int().positive()
  }))
})
```

### 2.3 对象操作

```javascript
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string()
})

// 选取部分字段
const PublicUserSchema = UserSchema.pick({ id: true, name: true })

// 排除部分字段
const UserWithoutPasswordSchema = UserSchema.omit({ password: true })

// 所有字段可选
const PartialUserSchema = UserSchema.partial()

// 所有字段必填
const RequiredUserSchema = PartialUserSchema.required()

// 扩展对象
const ExtendedUserSchema = UserSchema.extend({
  role: z.enum(['user', 'admin']),
  createdAt: z.date()
})

// 合并对象
const AddressSchema = z.object({
  city: z.string(),
  country: z.string()
})
const UserWithAddressSchema = UserSchema.merge(AddressSchema)
```

### 2.4 严格模式

```javascript
// 默认: 忽略额外字段
const schema = z.object({ name: z.string() })
schema.parse({ name: 'John', age: 25 })
// ✅ 返回 { name: 'John' }

// 严格模式: 拒绝额外字段
const strictSchema = z.object({ name: z.string() }).strict()
strictSchema.parse({ name: 'John', age: 25 })
// ❌ 抛出错误

// 透传模式: 保留额外字段
const passthroughSchema = z.object({ name: z.string() }).passthrough()
passthroughSchema.parse({ name: 'John', age: 25 })
// ✅ 返回 { name: 'John', age: 25 }
```

---

## 3. 数组与元组

### 3.1 数组

```javascript
// 字符串数组
const stringArraySchema = z.array(z.string())
stringArraySchema.parse(['a', 'b', 'c']) // ✅

// 数组长度限制
const limitedArray = z.array(z.number())
  .min(1, '至少需要1个元素')
  .max(10, '最多10个元素')
  .length(5, '必须是5个元素')

// 非空数组
const nonEmptyArray = z.array(z.string()).nonempty('数组不能为空')

// 快捷写法
const arr1 = z.string().array() // 等同于 z.array(z.string())
```

### 3.2 元组

```javascript
// 固定长度和类型的数组
const tupleSchema = z.tuple([
  z.string(),  // 第一个元素必须是字符串
  z.number(),  // 第二个元素必须是数字
  z.boolean()  // 第三个元素必须是布尔值
])

tupleSchema.parse(['hello', 42, true]) // ✅

// 带剩余元素的元组
const tupleWithRest = z.tuple([z.string(), z.number()]).rest(z.boolean())
tupleWithRest.parse(['hello', 42, true, false, true]) // ✅
```

---

## 4. 字符串验证

```javascript
// 长度限制
z.string().min(1, '不能为空')
z.string().max(100, '最多100个字符')
z.string().length(6, '必须是6个字符')

// 格式验证
z.string().email('邮箱格式不正确')
z.string().url('URL格式不正确')
z.string().uuid('UUID格式不正确')
z.string().cuid()
z.string().cuid2()
z.string().ulid()
z.string().ip()
z.string().datetime()

// 正则表达式
z.string().regex(/^[a-zA-Z0-9]+$/, '只能包含字母和数字')

// 常用模式
z.string().startsWith('https://', '必须以https://开头')
z.string().endsWith('.com', '必须以.com结尾')
z.string().includes('@', '必须包含@')

// 转换
z.string().trim()         // 去除首尾空格
z.string().toLowerCase()  // 转小写
z.string().toUpperCase()  // 转大写

// 非空 (Zod 4.x)
z.string().nonempty('不能为空字符串')

// 组合使用
const usernameSchema = z.string()
  .min(3, '用户名至少3个字符')
  .max(20, '用户名最多20个字符')
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '用户名必须以字母开头')
  .trim()
```

---

## 5. 数字验证

```javascript
// 基础数字
z.number()

// 整数
z.number().int('必须是整数')

// 范围
z.number().min(0, '不能小于0')
z.number().max(100, '不能大于100')
z.number().positive('必须是正数')
z.number().negative('必须是负数')
z.number().nonnegative('必须是非负数')
z.number().nonpositive('必须是非正数')

// 倍数
z.number().multipleOf(5, '必须是5的倍数')

// 有限数 (排除 Infinity)
z.number().finite()

// 安全整数
z.number().safe() // Number.MIN_SAFE_INTEGER ~ Number.MAX_SAFE_INTEGER

// 组合示例
const ageSchema = z.number()
  .int('年龄必须是整数')
  .min(0, '年龄不能为负')
  .max(150, '年龄不能超过150')

const priceSchema = z.number()
  .positive('价格必须为正数')
  .multipleOf(0.01, '价格最多两位小数')
```

---

## 6. 可选与默认值

### 6.1 可选字段

```javascript
const UserSchema = z.object({
  name: z.string(),
  email: z.string().optional(),   // string | undefined
  age: z.number().nullable(),      // number | null
  bio: z.string().nullish()        // string | null | undefined
})

UserSchema.parse({ name: 'John' })                    // ✅
UserSchema.parse({ name: 'John', email: undefined })  // ✅
UserSchema.parse({ name: 'John', age: null })         // ✅
```

### 6.2 默认值

```javascript
const ConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(3000),
  debug: z.boolean().default(false),
  tags: z.array(z.string()).default([])
})

ConfigSchema.parse({})
// { host: 'localhost', port: 3000, debug: false, tags: [] }

ConfigSchema.parse({ port: 8080 })
// { host: 'localhost', port: 8080, debug: false, tags: [] }

// 使用函数生成默认值
const TimestampSchema = z.object({
  createdAt: z.date().default(() => new Date())
})
```

### 6.3 强制转换

```javascript
// 字符串转数字
const coercedNumber = z.coerce.number()
coercedNumber.parse('42')  // ✅ 返回 42
coercedNumber.parse(42)    // ✅ 返回 42

// 字符串转布尔
const coercedBoolean = z.coerce.boolean()
coercedBoolean.parse('true')   // ✅ 返回 true
coercedBoolean.parse('false')  // ✅ 返回 true (非空字符串都是true!)
coercedBoolean.parse('')       // ✅ 返回 false

// 字符串转日期
const coercedDate = z.coerce.date()
coercedDate.parse('2024-01-01')  // ✅ 返回 Date 对象
```

---

## 7. 枚举与联合类型

### 7.1 枚举

```javascript
// Zod 枚举
const StatusSchema = z.enum(['pending', 'active', 'deleted'])
StatusSchema.parse('active')  // ✅
StatusSchema.parse('unknown') // ❌

// 获取枚举值
StatusSchema.enum.pending  // 'pending'
StatusSchema.options       // ['pending', 'active', 'deleted']

// 原生枚举
const RoleEnum = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
}
const RoleSchema = z.nativeEnum(RoleEnum)
```

### 7.2 联合类型

```javascript
// 基础联合
const stringOrNumber = z.union([z.string(), z.number()])
stringOrNumber.parse('hello')  // ✅
stringOrNumber.parse(42)       // ✅

// 快捷写法
const strOrNum = z.string().or(z.number())

// 可辨识联合 (推荐)
const ResponseSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('success'), data: z.any() }),
  z.object({ type: z.literal('error'), message: z.string() })
])

ResponseSchema.parse({ type: 'success', data: { id: 1 } }) // ✅
ResponseSchema.parse({ type: 'error', message: 'Failed' }) // ✅
```

### 7.3 交叉类型

```javascript
const PersonSchema = z.object({
  name: z.string()
})

const EmployeeSchema = z.object({
  employeeId: z.string()
})

// 交叉类型 (合并)
const EmployeePersonSchema = z.intersection(PersonSchema, EmployeeSchema)
// 等同于
const EmployeePersonSchema2 = PersonSchema.and(EmployeeSchema)

EmployeePersonSchema.parse({
  name: 'John',
  employeeId: 'E001'
}) // ✅
```

---

## 8. 数据转换

### 8.1 transform

```javascript
// 转换返回值
const lowercaseEmail = z.string().email().transform((val) => val.toLowerCase())
lowercaseEmail.parse('JOHN@EXAMPLE.COM')
// 返回 'john@example.com'

// 复杂转换
const UserInputSchema = z.object({
  name: z.string().transform((val) => val.trim()),
  email: z.string().email().transform((val) => val.toLowerCase()),
  age: z.string().transform((val) => parseInt(val, 10))
})

// 类型转换
const DateStringSchema = z.string().transform((val) => new Date(val))
```

### 8.2 preprocess

```javascript
// 预处理 (在验证前转换)
const numberFromString = z.preprocess(
  (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
  z.number()
)

numberFromString.parse('42')  // ✅ 返回 42
numberFromString.parse(42)    // ✅ 返回 42
```

### 8.3 refine (自定义验证后转换)

```javascript
const PasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword']
})

PasswordSchema.parse({
  password: '123456',
  confirmPassword: '123456'
}) // ✅

PasswordSchema.parse({
  password: '123456',
  confirmPassword: '654321'
}) // ❌ 两次密码不一致
```

---

## 9. 自定义验证

### 9.1 refine

```javascript
// 基础 refine
const positiveNumber = z.number().refine((val) => val > 0, {
  message: '必须是正数'
})

// 多条件验证
const passwordSchema = z.string()
  .min(8, '密码至少8位')
  .refine((val) => /[A-Z]/.test(val), {
    message: '密码必须包含大写字母'
  })
  .refine((val) => /[a-z]/.test(val), {
    message: '密码必须包含小写字母'
  })
  .refine((val) => /[0-9]/.test(val), {
    message: '密码必须包含数字'
  })
```

### 9.2 superRefine

```javascript
// 更灵活的验证
const formSchema = z.object({
  type: z.enum(['email', 'phone']),
  value: z.string()
}).superRefine((data, ctx) => {
  if (data.type === 'email') {
    if (!data.value.includes('@')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '邮箱格式不正确',
        path: ['value']
      })
    }
  } else if (data.type === 'phone') {
    if (!/^\d{11}$/.test(data.value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '手机号必须是11位数字',
        path: ['value']
      })
    }
  }
})
```

### 9.3 异步验证

```javascript
const uniqueEmailSchema = z.string().email().refine(
  async (email) => {
    // 模拟数据库查询
    const exists = await checkEmailExists(email)
    return !exists
  },
  { message: '邮箱已被注册' }
)

// 使用 parseAsync
await uniqueEmailSchema.parseAsync('john@example.com')
```

---

## 10. 错误处理

### 10.1 获取错误信息

```javascript
const UserSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  age: z.number().min(0, '年龄不能为负')
})

const result = UserSchema.safeParse({ name: '', age: -1 })

if (!result.success) {
  console.log(result.error.issues)
  /*
  [
    { code: 'too_small', path: ['name'], message: '姓名不能为空' },
    { code: 'too_small', path: ['age'], message: '年龄不能为负' }
  ]
  */

  // 格式化错误
  console.log(result.error.format())
  /*
  {
    _errors: [],
    name: { _errors: ['姓名不能为空'] },
    age: { _errors: ['年龄不能为负'] }
  }
  */

  // 扁平化错误
  console.log(result.error.flatten())
  /*
  {
    formErrors: [],
    fieldErrors: {
      name: ['姓名不能为空'],
      age: ['年龄不能为负']
    }
  }
  */
}
```

### 10.2 自定义错误消息

```javascript
// 方式1: 在方法中传入
z.string().min(1, '不能为空')
z.string().min(1, { message: '不能为空' })

// 方式2: 使用 errorMap
const customErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.too_small) {
    return { message: `最少需要 ${issue.minimum} 个字符` }
  }
  return { message: ctx.defaultError }
}

z.string().min(5).parse('hi', { errorMap: customErrorMap })
```

---

## 11. 项目实战

### 11.1 用户模块 Schema

```javascript
// src/schemas/models/userEntitySchema.js
import { z } from 'zod'

// 用户角色枚举
export const UserRole = Object.freeze({
  USER: 'user',
  ADMIN: 'admin'
})

// 登录请求
export const LoginBodySchema = z.object({
  username: z.string()
    .min(1, '用户名不能为空')
    .max(50, '用户名最多50个字符')
    .trim(),
  password: z.string()
    .min(6, '密码至少6位')
    .max(50, '密码最多50位')
})

// 注册请求
export const RegisterBodySchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '用户名必须以字母开头，只能包含字母数字下划线')
    .trim(),
  password: z.string()
    .min(6, '密码至少6位')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  confirmPassword: z.string(),
  email: z.string().email('邮箱格式不正确').optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword']
})

// 更新用户
export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional()
})

// 分页查询
export const UserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  keyword: z.string().optional(),
  status: z.enum(['active', 'inactive', 'deleted']).optional(),
  role: z.nativeEnum(UserRole).optional()
})
```

### 11.2 文章模块 Schema

```javascript
// src/schemas/models/articleSchema.js
import { z } from 'zod'

// 创建文章
export const CreateArticleSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题最多200个字符')
    .trim(),
  content: z.string()
    .min(10, '内容至少10个字符'),
  summary: z.string()
    .max(500, '摘要最多500个字符')
    .optional(),
  categoryId: z.number().int().positive('请选择分类'),
  tags: z.array(z.string()).max(10, '最多10个标签').default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  publishAt: z.coerce.date().optional()
})

// 更新文章 (所有字段可选)
export const UpdateArticleSchema = CreateArticleSchema.partial()

// 文章查询
export const ArticleQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(['draft', 'published', 'all']).default('all'),
  keyword: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'viewCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})
```

### 11.3 路由中使用

```javascript
// src/routers/router/usersRouter.js
import Router from '@koa/router'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { LoginBodySchema, RegisterBodySchema, UserQuerySchema } from '../../schemas/models/userEntitySchema.js'
import controller from '../../controllers/users/userController.js'

const router = new Router()

// POST 请求验证 body
router.post('/login', validateBody(LoginBodySchema), controller.login)
router.post('/register', validateBody(RegisterBodySchema), controller.register)

// GET 请求验证 query
router.get('/users', validateQuery(UserQuerySchema), controller.list)

export default router
```

### 11.4 验证中间件

```javascript
// src/middleware/validationMiddleware.js
import { createErrorResponse } from '../utils/createResponse.js'
import { HTTP_CODE } from '../config/httpError.js'

export const validateBody = (schema) => async (ctx, next) => {
  const parsed = schema.safeParse(ctx.request.body)
  if (!parsed.success) {
    ctx.status = HTTP_CODE.BAD_REQUEST
    ctx.body = createErrorResponse(
      parsed.error.issues[0]?.message || 'Validation failed',
      400
    )
    return
  }
  ctx.request.body = parsed.data
  await next()
}

export const validateQuery = (schema) => async (ctx, next) => {
  const parsed = schema.safeParse(ctx.query)
  if (!parsed.success) {
    ctx.status = HTTP_CODE.BAD_REQUEST
    ctx.body = createErrorResponse(
      parsed.error.issues[0]?.message || 'Validation failed',
      400
    )
    return
  }
  ctx.query = parsed.data
  await next()
}
```

---

## 参考链接

- [Zod 官方文档](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
