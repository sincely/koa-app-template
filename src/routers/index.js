import Router from 'koa-router'
import usersRouter from './router/usersRouter.js'
import { getOpenApiSpec } from '../docs/openapi.js'

const router = new Router()
router.get('/openapi.json', (ctx) => {
  ctx.status = 200
  ctx.type = 'application/json'
  ctx.body = getOpenApiSpec({ routers: [Routers, usersRouter], origin: ctx.origin })
})
router.get('/ping', (ctx) => {
  ctx.body = {
    status: ctx.status,
    message: 'success'
  }
})

router.use(usersRouter.routes())

export default router
