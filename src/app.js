import Koa from 'koa'
import KoaStatic from 'koa-static'
import KoaBody from 'koa-body'
import Session from 'koa-session'

import { Port, staticDir } from './config/setting.js'
import logger from './config/logger.js'

const app = new Koa()

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

// 监听服务器启动端口
app.listen(Port, () => {
  logger.info(`服务器启动在 http://localhost:${Port}`)
})
