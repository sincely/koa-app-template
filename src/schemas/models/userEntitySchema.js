import { z } from 'zod'

export const UserRole = Object.freeze({
  USER: 'user',
  AUTHOR: 'author'
})

export const userEntitySchema = z.object({
  id: z.number().int().nonnegative(),
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.enum([UserRole.USER, UserRole.AUTHOR]),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
})

export const CreateBookSchema = z.object({
  title: z.string().nonempty('Title cannot be empty!'),
  author: z.string().nonempty('Authro cannot be empty!')
})

export const UpdateBookSchema = CreateBookSchema.partial()

export const userBookSchema = z.object({
  book_id: z.number().int().nonnegative(),
  user_id: z.number().int().nonnegative()
})

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

export const FindUserNameBodySchema = z.object({
  username: z.string().min(1, 'username is required')
})

export const RegisterBodySchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required')
})
