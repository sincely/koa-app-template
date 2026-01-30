import { createErrorResponse } from '../utils/createResponse.js'
import { HTTP_CODE } from '../config/httpError.js'

const toZodErrorDetails = (error) => {
  const issues = Array.isArray(error?.issues) ? error.issues : []
  return issues.map((issue) => ({
    path: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path ?? ''),
    message: issue.message,
    code: issue.code
  }))
}

const firstZodMessage = (error) => {
  const issues = Array.isArray(error?.issues) ? error.issues : []
  return issues[0]?.message || 'Validation failed'
}

/**
 * @param {import('zod').ZodTypeAny} schema
 * @returns {import('koa').Middleware}
 */
export const validateBody = (schema) => async (ctx, next) => {
  const parsed = schema.safeParse(ctx.request.body)
  if (!parsed.success) {
    ctx.status = HTTP_CODE.BAD_REQUEST
    ctx.body = createErrorResponse(ctx.status, firstZodMessage(parsed.error))
    return
  }

  // 路由层统一读取 ctx.request.body，同时保留一份在 ctx.state
  ctx.state.data = parsed.data
  ctx.request.body = parsed.data
  await next()
}

/**
 * 校验 URL query（例如 GET /path?userName=...）
 * @param {import('zod').ZodTypeAny} schema
 * @returns {import('koa').Middleware}
 */
export const validateQuery = (schema) => async (ctx, next) => {
  console.log(ctx)
  const parsed = schema.safeParse(ctx.query)

  if (!parsed.success) {
    ctx.status = HTTP_CODE.BAD_REQUEST
    ctx.body = createErrorResponse(ctx.status, firstZodMessage(parsed.error))
    return
  }

  ctx.state.data = parsed.data
  ctx.query = parsed.data
  await next()
}

/**
 * 通用校验中间件，根据请求方法选择校验 body 或 query
 * @param {import('zod').ZodTypeAny} schema
 * @returns {import('koa').Middleware}
 */
export const validationMiddleware = (schema) => {
  return async (ctx, next) => {
    if (ctx.method === 'GET' || ctx.method === 'DELETE') {
      // 校验 query 参数
      return validateQuery(schema)(ctx, next)
    }
    // 校验 body 参数
    return validateBody(schema)(ctx, next)
  }
}
