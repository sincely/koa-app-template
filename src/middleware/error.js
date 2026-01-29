import logger from '../config/logger.js'

export default async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // Log error with full context
    const log = ctx.log || logger
    log.error(
      {
        err: error,
        request: {
          method: ctx.method,
          url: ctx.url,
          headers: ctx.headers
        }
      },
      'Request error'
    )

    ctx.status = error.status || 500
    ctx.body = {
      code: String(ctx.status),
      msg: error.message || '服务器未知错误'
    }
  }
}
