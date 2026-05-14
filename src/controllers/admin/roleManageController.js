/**
 * @module 角色管理
 * @description 处理后台角色及角色菜单权限的增删改查
 */

import adminRoleDao from '../../services/adminRoleDao.js'
import adminMenuDao from '../../services/adminMenuDao.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { httpCode } from '../../config/httpError.js'

/**
 * 获取角色列表 - 含绑定的菜单 ID 和菜单选项
 * @api GET /admin/system/roles
 * @description 角色管理 - 后台角色及角色菜单权限的增删改查
 */
const listRoles = async (ctx) => {
  const [roles, menus] = await Promise.all([adminRoleDao.listRoles(), adminMenuDao.listMenus()])
  const roleList = await Promise.all(
    roles.map(async (role) => {
      const routeIds = await adminRoleDao.getRouteIdsByRoleId(role.roleId)
      return {
        ...role,
        routeIds
      }
    })
  )

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取角色列表成功',
    data: {
      list: roleList,
      menuOptions: menus
    }
  }
}

/**
 * 创建角色 - 并绑定菜单权限
 * @api POST /admin/system/roles
 * @description 角色管理
 * @body {string} roleName - 角色名称
 * @body {string} description - 角色描述
 * @body {array} [routeIds] - 关联菜单 ID 列表
 */
const createRole = async (ctx) => {
  const { roleName, description, routeIds } = ctx.request.body
  const existedRole = await adminRoleDao.findRoleByName(roleName)

  if (existedRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleExist, msg: businessMsg[businessCode.roleExist] }
    return
  }

  const result = await adminRoleDao.createRoleWithRoutes({
    roleName,
    description,
    routeIds: [...new Set(routeIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '创建角色成功',
    data: {
      roleId: result.roleId
    }
  }
}

/**
 * 更新角色 - 重置角色菜单权限
 * @api PUT /admin/system/roles
 * @description 角色管理
 * @body {integer} roleId - 角色 ID
 * @body {string} roleName - 角色名称
 * @body {string} description - 角色描述
 * @body {array} [routeIds] - 关联菜单 ID 列表
 */
const updateRole = async (ctx) => {
  const { roleId, roleName, description, routeIds } = ctx.request.body
  const currentRole = await adminRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const existedRole = await adminRoleDao.findRoleByName(roleName)
  if (existedRole && existedRole.roleId !== roleId) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleExist, msg: businessMsg[businessCode.roleExist] }
    return
  }

  await adminRoleDao.updateRoleWithRoutes({
    roleId,
    roleName,
    description,
    routeIds: [...new Set(routeIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新角色成功'
  }
}

/**
 * 删除角色 - 清理角色菜单权限绑定
 * @api DELETE /admin/system/roles
 * @description 角色管理
 * @body {integer} roleId - 角色 ID
 */
const deleteRole = async (ctx) => {
  const { roleId } = ctx.request.body
  const currentRole = await adminRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const userCount = await adminRoleDao.countUsersByRoleId(roleId)
  if (userCount > 0) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleInUse, msg: businessMsg[businessCode.roleInUse] }
    return
  }

  await adminRoleDao.deleteRole(roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除角色成功'
  }
}

export default {
  listRoles,
  createRole,
  updateRole,
  deleteRole
}
