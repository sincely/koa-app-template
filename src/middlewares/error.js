import logger from '../config/logger.js'

export default async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const log = ctx.log || logger
    const requestId = ctx.state.requestId

    // 完整错误上报到服务端日志（含原始 message、堆栈）
    log.error(
      {
        err: error,
        requestId,
        request: {
          method: ctx.method,
          url: ctx.url,
          // 避免记录 authorization header 中的 token 明文
          headers: { ...ctx.headers, authorization: ctx.headers.authorization ? '[REDACTED]' : undefined }
        }
      },
      'Request error'
    )

    const status = error.status || error.statusCode || 500
    ctx.status = status

    // 5xx 错误不暴露内部细节，防止泄露数据库结构/文件路径等敏感信息
    const isServerError = status >= 500
    ctx.body = {
      code: error.code || String(status),
      msg: isServerError ? '服务器内部错误，请联系管理员' : error.message || '请求处理失败',
      requestId
    }
  }
}
