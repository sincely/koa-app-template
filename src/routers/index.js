import Router from '@koa/router'
import usersRouter from './router/usersRouter.js'

const router = new Router({ prefix: '/api' })
// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

router.use(usersRouter.routes(), usersRouter.allowedMethods())

export default router
