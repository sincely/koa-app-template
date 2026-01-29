import pinoHttp from 'pino-http'
import logger from '../config/logger.js'

const httpLogger = pinoHttp({
  logger,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent'
    }
    return 'info'
  },
  customSuccessMessage: function (req, res) {
    if (res.statusCode === 404) {
      return 'resource not found'
    }
    return `${req.method} ${req.url}`
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} - ${err.message}`
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'duration'
  }
})

export default async (ctx, next) => {
  httpLogger(ctx.req, ctx.res)
  ctx.log = ctx.req.log
  await next()
  // 将 Koa 解析的 query 和 body 挂载到原生 req 对象上，以便 pino serializer 访问
  ctx.req.query = ctx.request.query
  ctx.req.body = ctx.request.body
}
