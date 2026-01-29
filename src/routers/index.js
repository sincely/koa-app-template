import Router from 'koa-router'
import usersRouter from './router/usersRouter.js'
import { getOpenApiSpec } from '../docs/openapi.js'

const Routers = new Router()
Routers.get('/openapi.json', (ctx) => {
  ctx.status = 200
  ctx.type = 'application/json'
  ctx.body = getOpenApiSpec({ routers: [Routers, usersRouter], origin: ctx.origin })
})
Routers.get('/ping', (ctx) => {
  ctx.body = {
    status: ctx.status,
    message: 'success'
  }
})

Routers.use(usersRouter.routes())

export default Routers
