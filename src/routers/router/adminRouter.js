import Router from '@koa/router'
import AdminAuthController from '../../controllers/admin/authController.js'
import authenticate from '../../middleware/authenticate.js'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { loginRateLimiter } from '../../middleware/rateLimiter.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { AdminLoginBodySchema, AdminRegisterBodySchema } from '../../schemas/models/adminAuthSchema.js'

const adminRouter = new Router()

adminRouter.post(
  '/admin/auth/login',
  validateBody(AdminLoginBodySchema),
  loginRateLimiter,
  errorControllerWrapper(AdminAuthController.login)
)
adminRouter.post(
  '/admin/auth/register',
  validateBody(AdminRegisterBodySchema),
  errorControllerWrapper(AdminAuthController.register)
)
adminRouter.post('/admin/auth/logout', authenticate, errorControllerWrapper(AdminAuthController.logout))
adminRouter.get('/admin/auth/profile', authenticate, errorControllerWrapper(AdminAuthController.getProfile))
adminRouter.get('/admin/auth/menus', authenticate, errorControllerWrapper(AdminAuthController.getMenus))
adminRouter.get('/admin/auth/permissions', authenticate, errorControllerWrapper(AdminAuthController.getPermissions))

export default adminRouter
