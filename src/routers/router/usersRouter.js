import Router from '@koa/router'
// 导入控制层（模块化结构）
import User from '../../controllers/users/userController.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import authMiddleware from '../../middleware/authenticate.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { LoginBodySchema, FindUserNameBodySchema, RegisterBodySchema } from '../../schemas/models/userEntitySchema.js'

// 根路由已在 src/routers/index.js 统一挂载 ApiPrefix，这里不要重复添加 prefix
const usersRouter = new Router()

usersRouter.post('/user/login', validateBody(LoginBodySchema), errorControllerWrapper(User.login))
usersRouter.post('/user/findUserName', validateBody(FindUserNameBodySchema), errorControllerWrapper(User.findUserName))
usersRouter.post('/user/register', validateBody(RegisterBodySchema), errorControllerWrapper(User.register))

// 示例：需要登录态或 token 的路由
usersRouter.get(
  '/user/test',
  authMiddleware,
  validateQuery(LoginBodySchema),
  errorControllerWrapper((ctx) => {
    ctx.body = { ok: true, data: ctx.state.data }
  })
)

export default usersRouter
