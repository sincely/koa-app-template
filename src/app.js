import Koa from 'koa'
import KoaStatic from 'koa-static'
import KoaBody from 'koa-body'
import Session from 'koa-session'

import { Port, staticDir, DocsPort, docsDir } from './config/setting.js'
import logger from './config/logger.js'

const app = new Koa()
const docsApp = new Koa() // 文档服务实例

// HTTP请求日志中间件
import loggerMiddleware from './middleware/logger.js'
app.use(loggerMiddleware)

// 异常处理中间件
import error from './middleware/error.js'
app.use(error)

// 跨域处理
import cors from 'koa2-cors'
import corsConfig from './config/cors.js'
app.use(cors(corsConfig))

// 为静态资源请求重写url
import rewriteUrl from './middleware/rewriteUrl.js'
app.use(rewriteUrl)

// 响应压缩
import compress from './middleware/compress.js'
app.use(compress)

// 使用koa-static处理静态资源
app.use(KoaStatic(staticDir))

// session
import CONFIG from './middleware/session.js'
app.keys = ['session app keys']
app.use(Session(CONFIG, app))

// 判断是否登录
import isLogin from './middleware/isLogin.js'
app.use(isLogin)

app.use(async (ctx, next) => {
  ctx.state.user = ctx.session.user
  await next()
})

// 处理请求体数据
import koaBodyConfig from './middleware/koaBodyConfig.js'
app.use(KoaBody(koaBodyConfig))

// 使用路由中间件
import Routers from './routers/index.js'
app.use(Routers.routes()).use(Routers.allowedMethods())

// 配置文档服务 (docsify)
docsApp.use(async (ctx, next) => {
  // 默认访问 index.html
  if (ctx.path === '/') {
    ctx.path = '/index.html'
  }
  await next()
})
docsApp.use(KoaStatic(docsDir))

// 监听服务器启动端口
// 仅在非 Vercel 环境下启动服务器
// 本地开发：process.env.VERCEL 为 undefined（falsy），!process.env.VERCEL 为 true → 执行 app.listen()
// Vercel 部署：process.env.VERCEL 为 "1"（truthy），!process.env.VERCEL 为 false → 跳过 app.listen()
if (!process.env.VERCEL) {
  app.listen(Port, () => {
    logger.info(`服务器启动在 http://localhost:${Port}`)
  })

  // 启动文档服务
  docsApp.listen(DocsPort, () => {
    logger.info(`接口文档服务启动在 http://localhost:${DocsPort}`)
  })
}

// 导出 app 实例，用于 Vercel 等 serverless 平台部署
export default app
