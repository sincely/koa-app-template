import { createErrorResponse } from '../utils/createResponse.js'
import { httpCode } from '../config/httpError.js'

/**
 * 将 Zod 错误对象转换为统一的错误详情结构。
 * 该函数可用于后续扩展错误响应时返回完整 issue 列表。
 * @param {import('zod').ZodError | unknown} error
 * @returns {{path: string, message: string, code: string}[]}
 */
const toZodErrorDetails = (error) => {
  const issues = Array.isArray(error?.issues) ? error.issues : []
  return issues.map((issue) => ({
    path: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path ?? ''),
    message: issue.message,
    code: issue.code
  }))
}

/**
 * 取 Zod 首条错误信息，若为空则返回默认文案。
 * @param {import('zod').ZodError | unknown} error
 * @returns {string}
 */
const firstZodMessage = (error) => {
  const issues = Array.isArray(error?.issues) ? error.issues : []
  return issues[0]?.message || 'Validation failed'
}

/**
 * 校验请求体（body），失败时直接返回 400。
 * 校验通过后会把数据同步到 `ctx.request.body` 与 `ctx.state.data`。
 * @param {import('zod').ZodTypeAny} schema
 * @returns {import('koa').Middleware}
 */
export const validateBody = (schema) => async (ctx, next) => {
  const parsed = schema.safeParse(ctx.request.body)
  if (!parsed.success) {
    ctx.status = httpCode.badRequest
    ctx.body = createErrorResponse(firstZodMessage(parsed.error), ctx.status)
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
  const parsed = schema.safeParse(ctx.query)

  if (!parsed.success) {
    ctx.status = httpCode.badRequest
    ctx.body = createErrorResponse(firstZodMessage(parsed.error), ctx.status)
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
