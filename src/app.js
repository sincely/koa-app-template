// 第三方库
import Koa from 'koa'
import KoaStatic from 'koa-static'
import cors from 'koa2-cors'
import session from 'koa-session'
import KoaBodyParser from '@koa/bodyparser'

// 配置文件
import { Port, staticDir } from './config/server.js'
import logger from './config/logger.js'
import corsConfig from './config/cors.js'
import { bodyParserConfig } from './config/koaBodyConfig.js'

// 中间件
import requestId from './middleware/requestId.js'
import loggerMiddleware from './middleware/logger.js'
import error from './middleware/error.js'
import rewriteUrl from './middleware/rewriteUrl.js'
import compress from './middleware/compress.js'

// 路由
import Routers from './routers/index.js'

// 插件
import { registerSwagger } from './plugins/swagger.js'

const app = new Koa()
app.keys = [process.env.SESSION_SECRET || process.env.JWT_SECRET || 'koa-app-template-session-secret']

// 请求 ID 中间件（最先注册，确保后续所有中间件都能读取到 requestId）
app.use(requestId)

// HTTP请求日志中间件
app.use(loggerMiddleware)

// 异常处理中间件
app.use(error)

// 跨域处理
app.use(cors(corsConfig))

app.use(
  session(
    {
      key: 'koa.sess',
      maxAge: 86400000,
      httpOnly: true,
      signed: true,
      renew: true
    },
    app
  )
)

// 为静态资源请求重写url
app.use(rewriteUrl)

// 响应压缩
app.use(compress)

// 使用koa-static处理静态资源
app.use(KoaStatic(staticDir))

app.use(async (ctx, next) => {
  ctx.state.user = ctx.session?.user
  await next()
})

// 处理请求体数据（必须在路由之前注册）
app.use(KoaBodyParser(bodyParserConfig))

// 使用路由中间件
app.use(Routers.routes()).use(Routers.allowedMethods())

// 注册 Swagger API 文档（替代原 docsify 文档服务）
registerSwagger(app)

// 监听服务器启动端口
// 仅在非 Vercel 环境下启动服务器
// 本地开发：process.env.VERCEL 为 undefined（falsy），!process.env.VERCEL 为 true → 执行 app.listen()
// Vercel 部署：process.env.VERCEL 为 "1"（truthy），!process.env.VERCEL 为 false → 跳过 app.listen()
if (!process.env.VERCEL) {
  app.listen(Port, () => {
    logger.info(`服务器启动在 http://localhost:${Port}`)
    logger.info(`Swagger 文档地址 http://localhost:${Port}/docs`)
  })
}

// 导出 app 实例，用于 Vercel 等 serverless 平台部署
export default app
