import logger from '../config/logger.js'
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
 * - HTTP 异常（4xx）：记录 warn 日志，返回失败响应
 * - 非 HTTP 异常（5xx）：记录完整错误堆栈 error 日志，返回 500 错误响应
 */
export const errorControllerWrapper = (controller) => {
  return async (ctx, next) => {
    try {
      await controller(ctx, next)
    } catch (err) {
      const requestId = ctx.state?.requestId
      const requestInfo = {
        method: ctx.method,
        url: ctx.url,
        requestId,
        // 避免记录 authorization header 中的 token 明文
        headers: { ...ctx.headers, authorization: ctx.headers.authorization ? '[REDACTED]' : undefined }
      }

      if (isHttpError(err)) {
        // HTTP 业务异常（4xx）：warn 级别，不需要完整堆栈
        const status = err.status ?? err.statusCode
        ctx.status = status
        ctx.body = createFailResponse(err.message || 'Request failed', ctx.status)
        logger.warn({ err, status, ...requestInfo }, `HTTP ${status}: ${err.message}`)
        return
      }

      // 非预期异常（5xx）：error 级别，记录完整堆栈方便定位崩溃位置
      ctx.status = 500
      ctx.body = createErrorResponse('Something went wrong', ctx.status, {}, err)
      logger.error({ err, status: 500, ...requestInfo }, `Unhandled error: ${err.message || 'Unknown error'}`)
    }
  }
}
