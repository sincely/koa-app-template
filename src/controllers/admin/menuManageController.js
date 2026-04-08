/**
 * @module 菜单管理
 * @description 处理后台菜单管理相关的增删改查
 */

import adminMenuDao from '../../models/dao/adminMenuDao.js'
import { buildMenuTree } from '../../utils/adminPermission.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { httpCode } from '../../config/httpError.js'

const toMenuPayload = ({ path, name, component, redirect, meta, parentId }) => {
  return {
    path,
    name,
    component: component ?? null,
    redirect: redirect ?? null,
    meta: JSON.stringify(meta ?? {}),
    parent_id: parentId ?? null
  }
}

/**
 * @summary 获取菜单列表
 * @description 获取菜单平铺列表和树形结构
 * @api GET /admin/system/menus
 * @returns {object} 200 - 获取成功
 */
const listMenus = async (ctx) => {
  const menus = await adminMenuDao.listMenus()

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取菜单列表成功',
    data: {
      list: menus,
      tree: buildMenuTree(menus)
    }
  }
}

/**
 * @summary 创建菜单
 * @description 创建新的后台菜单节点
 * @api POST /admin/system/menus
 * @param {string} path - 菜单访问路径
 * @param {string} name - 菜单名称
 * @param {string} component - 前端组件路径
 * @param {string} redirect - 重定向路径
 * @param {object} meta - 菜单元信息
 * @param {number} parentId - 父级菜单 ID
 * @returns {object} 200 - 创建成功
 */
const createMenu = async (ctx) => {
  const { path, name, component, redirect, meta, parentId } = ctx.request.body
  const [existedPath, existedName] = await Promise.all([
    adminMenuDao.findMenuByPath(path),
    adminMenuDao.findMenuByName(name)
  ])

  if (existedPath) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.menuPathExist, msg: businessMsg[businessCode.menuPathExist] }
    return
  }

  if (existedName) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.menuNameExist, msg: businessMsg[businessCode.menuNameExist] }
    return
  }

  if (parentId) {
    const parentMenu = await adminMenuDao.findMenuById(parentId)
    if (!parentMenu) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.paramError, msg: '父级菜单不存在' }
      return
    }
  }

  const result = await adminMenuDao.createMenu(toMenuPayload({ path, name, component, redirect, meta, parentId }))

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '创建菜单成功',
    data: {
      id: result.insertId
    }
  }
}

/**
 * @summary 更新菜单
 * @description 更新后台菜单节点信息
 * @api PUT /admin/system/menus
 * @param {number} id - 菜单 ID
 * @param {string} path - 菜单访问路径
 * @param {string} name - 菜单名称
 * @param {string} component - 前端组件路径
 * @param {string} redirect - 重定向路径
 * @param {object} meta - 菜单元信息
 * @param {number} parentId - 父级菜单 ID
 * @returns {object} 200 - 更新成功
 */
const updateMenu = async (ctx) => {
  const { id, path, name, component, redirect, meta, parentId } = ctx.request.body
  const currentMenu = await adminMenuDao.findMenuById(id)

  if (!currentMenu) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.error, msg: '菜单不存在' }
    return
  }

  if (path) {
    const existedPath = await adminMenuDao.findMenuByPath(path)
    if (existedPath && existedPath.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.menuPathExist, msg: businessMsg[businessCode.menuPathExist] }
      return
    }
  }

  if (name) {
    const existedName = await adminMenuDao.findMenuByName(name)
    if (existedName && existedName.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.menuNameExist, msg: businessMsg[businessCode.menuNameExist] }
      return
    }
  }

  if (parentId !== undefined) {
    if (parentId === id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.paramError, msg: '父级菜单不能选择自己' }
      return
    }

    if (parentId !== null) {
      const parentMenu = await adminMenuDao.findMenuById(parentId)
      if (!parentMenu) {
        ctx.status = httpCode.ok
        ctx.body = { code: businessCode.paramError, msg: '父级菜单不存在' }
        return
      }
    }
  }

  const payload = {}
  if (path !== undefined) {
    payload.path = path
  }
  if (name !== undefined) {
    payload.name = name
  }
  if (component !== undefined) {
    payload.component = component ?? null
  }
  if (redirect !== undefined) {
    payload.redirect = redirect ?? null
  }
  if (meta !== undefined) {
    payload.meta = JSON.stringify(meta ?? {})
  }
  if (parentId !== undefined) {
    payload.parent_id = parentId ?? null
  }

  await adminMenuDao.updateMenu(id, payload)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新菜单成功'
  }
}

/**
 * @summary 删除菜单
 * @description 删除指定菜单节点
 * @api DELETE /admin/system/menus
 * @param {number} id - 菜单 ID
 * @returns {object} 200 - 删除成功
 */
const deleteMenu = async (ctx) => {
  const { id } = ctx.request.body
  const currentMenu = await adminMenuDao.findMenuById(id)

  if (!currentMenu) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.error, msg: '菜单不存在' }
    return
  }

  const childrenCount = await adminMenuDao.countChildren(id)
  if (childrenCount > 0) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.menuHasChildren, msg: businessMsg[businessCode.menuHasChildren] }
    return
  }

  await adminMenuDao.deleteMenu(id)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除菜单成功'
  }
}

export default {
  listMenus,
  createMenu,
  updateMenu,
  deleteMenu
}
