import Router from '@koa/router'
import usersRouter from './router/usersRouter.js'
import adminRouter from './router/adminRouter.js'
import adminManageRouter from './router/adminManageRouter.js'

const router = new Router({ prefix: '/api' })
// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

router.use(usersRouter.routes(), usersRouter.allowedMethods())
router.use(adminRouter.routes(), adminRouter.allowedMethods())
router.use(adminManageRouter.routes(), adminManageRouter.allowedMethods())

export default router
