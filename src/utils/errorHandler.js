import { createErrorResponse, createFailResponse } from './createResponse.js'

/**
 * 判断错误对象是否为 HTTP 错误（包含可用状态码）。
 * 兼容常见的 `status` 与 `statusCode` 字段。
 * @param {unknown} err
 * @returns {boolean}
 */
const isHttpError = (err) => {
  if (!err || typeof err !== 'object') {
    return false
  }
  const status = err.status ?? err.statusCode
  return typeof status === 'number' && Number.isFinite(status)
}

/**
 * 包装 controller，统一捕获异常并输出标准响应。
 * - HTTP 异常：返回失败响应（保留状态码）
 * - 非 HTTP 异常：返回 500 错误响应
 */
export const errorControllerWrapper = (controller) => {
  return async (ctx, next) => {
    try {
      await controller(ctx, next)
    } catch (err) {
      if (isHttpError(err)) {
        const status = err.status ?? err.statusCode
        ctx.status = status
        ctx.body = createFailResponse(err.message || 'Request failed', ctx.status)
        return
      }

      ctx.status = 500
      ctx.body = createErrorResponse('Something went wrong', ctx.status, {})
    }
  }
}
