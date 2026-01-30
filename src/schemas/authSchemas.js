import { z } from 'zod'
import { UserRole } from './userEntitySchema.js'

export const RegisterUserSchema = z.object({
  username: z.string().nonempty('Username is required!'),
  password: z.string().nonempty('Password is required!'),
  confirmPassword: z.string().nonempty('Confirm Password is required!'),
  role: z.enum([UserRole.USER, UserRole.AUTHOR]).optional().default(UserRole.USER)
})

export const LoginUserSchema = z.object({
  username: z.string().nonempty('Username is required!'),
  password: z.string().nonempty('Password is required!')
})
