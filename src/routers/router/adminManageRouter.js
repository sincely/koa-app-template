import Router from '@koa/router'
import UserManageController from '../../controllers/admin/userManageController.js'
import RoleManageController from '../../controllers/admin/roleManageController.js'
import MenuManageController from '../../controllers/admin/menuManageController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  AdminMenuCreateBodySchema,
  AdminMenuDeleteBodySchema,
  AdminMenuUpdateBodySchema,
  AdminRoleCreateBodySchema,
  AdminRoleDeleteBodySchema,
  AdminRoleUpdateBodySchema,
  AdminUserCreateBodySchema,
  AdminUserDeleteBodySchema,
  AdminUserListQuerySchema,
  AdminUserUpdateBodySchema
} from '../../schemas/models/adminManageSchema.js'

const adminManageRouter = new Router()

const useAccountManagePermission = [authenticate, authorizeRoute('/system/accountManage')]
const useRoleManagePermission = [authenticate, authorizeRoute('/system/roleManage')]
const useMenuManagePermission = [authenticate, authorizeRoute('/system/menuMange')]

adminManageRouter.get(
  '/admin/system/users',
  ...useAccountManagePermission,
  validateQuery(AdminUserListQuerySchema),
  errorControllerWrapper(UserManageController.listUsers)
)
adminManageRouter.post(
  '/admin/system/users',
  ...useAccountManagePermission,
  validateBody(AdminUserCreateBodySchema),
  errorControllerWrapper(UserManageController.createUser)
)
adminManageRouter.put(
  '/admin/system/users',
  ...useAccountManagePermission,
  validateBody(AdminUserUpdateBodySchema),
  errorControllerWrapper(UserManageController.updateUser)
)
adminManageRouter.delete(
  '/admin/system/users',
  ...useAccountManagePermission,
  validateBody(AdminUserDeleteBodySchema),
  errorControllerWrapper(UserManageController.deleteUser)
)

adminManageRouter.get(
  '/admin/system/roles',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.listRoles)
)
adminManageRouter.post(
  '/admin/system/roles',
  ...useRoleManagePermission,
  validateBody(AdminRoleCreateBodySchema),
  errorControllerWrapper(RoleManageController.createRole)
)
adminManageRouter.put(
  '/admin/system/roles',
  ...useRoleManagePermission,
  validateBody(AdminRoleUpdateBodySchema),
  errorControllerWrapper(RoleManageController.updateRole)
)
adminManageRouter.delete(
  '/admin/system/roles',
  ...useRoleManagePermission,
  validateBody(AdminRoleDeleteBodySchema),
  errorControllerWrapper(RoleManageController.deleteRole)
)

adminManageRouter.get(
  '/admin/system/menus',
  ...useMenuManagePermission,
  errorControllerWrapper(MenuManageController.listMenus)
)
adminManageRouter.post(
  '/admin/system/menus',
  ...useMenuManagePermission,
  validateBody(AdminMenuCreateBodySchema),
  errorControllerWrapper(MenuManageController.createMenu)
)
adminManageRouter.put(
  '/admin/system/menus',
  ...useMenuManagePermission,
  validateBody(AdminMenuUpdateBodySchema),
  errorControllerWrapper(MenuManageController.updateMenu)
)
adminManageRouter.delete(
  '/admin/system/menus',
  ...useMenuManagePermission,
  validateBody(AdminMenuDeleteBodySchema),
  errorControllerWrapper(MenuManageController.deleteMenu)
)

export default adminManageRouter
