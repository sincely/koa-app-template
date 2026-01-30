import Router from '@koa/router'
import usersRouter from './router/usersRouter.js'
import { ApiPrefix } from '../config/setting.js'

const router = new Router({ prefix: ApiPrefix })
router.get('/ping', (ctx) => {
  ctx.body = {
    status: ctx.status,
    message: 'success'
  }
})

router.use(usersRouter.routes())
router.use(usersRouter.allowedMethods())

export default router
