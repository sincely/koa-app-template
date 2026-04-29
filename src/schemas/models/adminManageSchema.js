import { z } from 'zod'

// 用户状态枚举
const userStatusEnum = z.enum(['active', 'inactive', 'banned'])
// 性别枚举
const genderEnum = z.enum(['male', 'female', 'other'])

// 用户列表查询参数
export const AdminUserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  keyword: z.string().trim().optional().default(''),
  status: userStatusEnum.optional(),
  roleId: z.coerce.number().int().positive().optional()
})

// 创建用户请求体
export const AdminUserCreateBodySchema = z.object({
  username: z.string().min(2, '用户名至少 2 位').max(50, '用户名最长 50 位'),
  password: z.string().min(6, '密码至少 6 位').max(20, '密码最长 20 位'),
  gender: genderEnum.default('other'),
  age: z.coerce.number().int().min(0).max(150).nullable().optional(),
  idCard: z.string().min(6, '身份证号不能为空').max(20, '身份证号最长 20 位'),
  email: z.email('邮箱格式不正确'),
  address: z.string().max(255, '地址最长 255 位').nullable().optional(),
  status: userStatusEnum.default('active'),
  avatar: z.string().max(255, '头像地址最长 255 位').nullable().optional(),
  roleId: z.coerce.number().int().positive()
})

// 更新用户请求体（至少提供一个变更字段）
export const AdminUserUpdateBodySchema = z
  .object({
    id: z.coerce.number().int().positive(),
    password: z.string().min(6, '密码至少 6 位').max(20, '密码最长 20 位').optional(),
    gender: genderEnum.optional(),
    age: z.coerce.number().int().min(0).max(150).nullable().optional(),
    idCard: z.string().min(6, '身份证号不能为空').max(20, '身份证号最长 20 位').optional(),
    email: z.email('邮箱格式不正确').optional(),
    address: z.string().max(255, '地址最长 255 位').nullable().optional(),
    status: userStatusEnum.optional(),
    avatar: z.string().max(255, '头像地址最长 255 位').nullable().optional(),
    roleId: z.coerce.number().int().positive().optional()
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: '至少提供一个需要更新的字段'
  })

// 删除用户请求体
export const AdminUserDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive()
})

// 创建角色请求体
export const AdminRoleCreateBodySchema = z.object({
  roleName: z.string().min(2, '角色名至少 2 位').max(50, '角色名最长 50 位'),
  description: z.string().max(255, '角色描述最长 255 位').optional().default(''),
  routeIds: z.array(z.coerce.number().int().positive()).default([])
})

// 更新角色请求体
export const AdminRoleUpdateBodySchema = z.object({
  roleId: z.coerce.number().int().positive(),
  roleName: z.string().min(2, '角色名至少 2 位').max(50, '角色名最长 50 位'),
  description: z.string().max(255, '角色描述最长 255 位').optional().default(''),
  routeIds: z.array(z.coerce.number().int().positive()).default([])
})

// 删除角色请求体
export const AdminRoleDeleteBodySchema = z.object({
  roleId: z.coerce.number().int().positive()
})

// 创建菜单请求体
export const AdminMenuCreateBodySchema = z.object({
  path: z.string().min(1, 'path 不能为空').max(255, 'path 最长 255 位'),
  name: z.string().min(1, 'name 不能为空').max(255, 'name 最长 255 位'),
  component: z.string().max(255, 'component 最长 255 位').nullable().optional(),
  redirect: z.string().max(255, 'redirect 最长 255 位').nullable().optional(),
  meta: z.record(z.string(), z.any()).optional().default({}),
  parentId: z.coerce.number().int().positive().nullable().optional()
})

// 更新菜单请求体（至少提供一个变更字段）
export const AdminMenuUpdateBodySchema = z
  .object({
    id: z.coerce.number().int().positive(),
    path: z.string().min(1, 'path 不能为空').max(255, 'path 最长 255 位').optional(),
    name: z.string().min(1, 'name 不能为空').max(255, 'name 最长 255 位').optional(),
    component: z.string().max(255, 'component 最长 255 位').nullable().optional(),
    redirect: z.string().max(255, 'redirect 最长 255 位').nullable().optional(),
    meta: z.record(z.string(), z.any()).optional(),
    parentId: z.coerce.number().int().positive().nullable().optional()
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: '至少提供一个需要更新的字段'
  })

// 删除菜单请求体
export const AdminMenuDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive()
})
