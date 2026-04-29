import { z } from 'zod'

// 系统用户角色枚举
export const UserRole = Object.freeze({
  USER: 'user',
  AUTHOR: 'author'
})

// 用户实体基础结构（数据库字段）
export const userEntitySchema = z.object({
  id: z.number().int().nonnegative(),
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.enum([UserRole.USER, UserRole.AUTHOR]),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
})

// 书籍创建参数
export const CreateBookSchema = z.object({
  title: z.string().nonempty('Title cannot be empty!'),
  author: z.string().nonempty('Authro cannot be empty!')
})

// 书籍更新参数（基于创建参数的可选版本）
export const UpdateBookSchema = CreateBookSchema.partial()

// 用户与书籍关系结构
export const userBookSchema = z.object({
  book_id: z.number().int().nonnegative(),
  user_id: z.number().int().nonnegative()
})

// 用户登录请求体（确保 username 必填并返回规范化结构）
export const LoginBodySchema = z
  .object({
    username: z.string().min(1, 'username is required').optional(),
    password: z.string().min(1, 'password is required')
  })
  .refine((data) => Boolean(data.username), {
    message: 'username is required'
  })
  .transform((data) => ({
    username: data.username,
    password: data.password
  }))

// 查询用户名请求体
export const FindUserNameBodySchema = z.object({
  username: z.string().min(1, 'username is required')
})

// 用户注册请求体
export const RegisterBodySchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required')
})
