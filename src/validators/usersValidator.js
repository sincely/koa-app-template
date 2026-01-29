import { Joi } from '../utils/validateParams.js'

// 定义用户信息的 schema
export const userSchema = Joi.object({
  userName: Joi.string()
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/)
    .required()
    .messages({
      'string.pattern.base': '用户名不合法(以字母开头，允许5-16字节，允许字母数字下划线)',
      'string.empty': '用户名不能为空',
      'any.required': '用户名不能为空'
    }),
  password: Joi.string()
    .pattern(/^[a-zA-Z]\w{5,17}$/)
    .required()
    .messages({
      'string.pattern.base': '密码不合法(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)',
      'string.empty': '密码不能为空',
      'any.required': '密码不能为空'
    })
})

// 定义仅校验用户名的 schema
export const userNameSchema = Joi.object({
  userName: Joi.string()
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/)
    .required()
    .messages({
      'string.pattern.base': '用户名不合法(以字母开头，允许5-16字节，允许字母数字下划线)',
      'string.empty': '用户名不能为空',
      'any.required': '用户名不能为空'
    })
})
