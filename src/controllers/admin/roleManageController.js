/**
 * @module 角色管理
 * @description 处理后台角色及角色菜单权限的增删改查
 */

import adminRoleDao from '../../models/dao/adminRoleDao.js'
import adminMenuDao from '../../models/dao/adminMenuDao.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { httpCode } from '../../config/httpError.js'

/**
 * @summary 获取角色列表
 * @description 获取角色列表、绑定的菜单 ID 以及菜单选项
 * @api GET /admin/system/roles
 * @returns {object} 200 - 获取成功
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
 * @summary 创建角色
 * @description 创建新角色并绑定菜单权限
 * @api POST /admin/system/roles
 * @param {string} roleName - 角色名称
 * @param {string} description - 角色描述
 * @param {array} routeIds - 关联菜单 ID 列表
 * @returns {object} 200 - 创建成功
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
 * @summary 更新角色
 * @description 更新角色信息并重置角色菜单权限
 * @api PUT /admin/system/roles
 * @param {number} roleId - 角色 ID
 * @param {string} roleName - 角色名称
 * @param {string} description - 角色描述
 * @param {array} routeIds - 关联菜单 ID 列表
 * @returns {object} 200 - 更新成功
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
 * @summary 删除角色
 * @description 删除角色及其菜单权限绑定
 * @api DELETE /admin/system/roles
 * @param {number} roleId - 角色 ID
 * @returns {object} 200 - 删除成功
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
