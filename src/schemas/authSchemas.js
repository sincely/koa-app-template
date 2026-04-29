import { z } from 'zod'
import { UserRole } from './userEntitySchema.js'

// 通用注册请求体（默认普通用户角色）
export const RegisterUserSchema = z.object({
  username: z.string().nonempty('Username is required!'),
  password: z.string().nonempty('Password is required!'),
  confirmPassword: z.string().nonempty('Confirm Password is required!'),
  role: z.enum([UserRole.USER, UserRole.AUTHOR]).optional().default(UserRole.USER)
})

// 通用登录请求体
export const LoginUserSchema = z.object({
  username: z.string().nonempty('Username is required!'),
  password: z.string().nonempty('Password is required!')
})
