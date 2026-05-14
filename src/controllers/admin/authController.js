/**
 * @module 后台认证
 * @description 处理后台登录、注册、退出和权限信息获取
 */

import adminAuthDao from '../../services/adminAuthDao.js'
import adminPermissionDao from '../../services/adminPermissionDao.js'
import { httpCode } from '../../config/httpError.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { defaultAdminRoleName } from '../../config/admin.js'
import { hashPassword, comparePassword } from '../../utils/password.js'
import { generateToken, decodeToken } from '../../utils/jwt.js'
import { buildMenuTree, extractPermissionCodes } from '../../utils/adminPermission.js'
import { getRedisClient } from '../../utils/redis.js'

const formatUserInfo = (user) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    status: user.status,
    avatar: user.avatar,
    roleId: user.roleId,
    roleName: user.roleName,
    roleDescription: user.roleDescription
  }
}

const buildPermissionSnapshot = async (roleId) => {
  const menus = await adminPermissionDao.findMenusByRoleId(roleId)
  const buttons = await adminPermissionDao.findButtonsByRoleId(roleId)

  return {
    menuTree: buildMenuTree(menus),
    buttons,
    permissionCodes: extractPermissionCodes(menus, buttons)
  }
}

/**
 * 后台注册 - 注册后台账号并绑定默认角色
 * @api POST /admin/auth/register
 * @description 后台认证 - 后台登录、注册、退出和权限信息获取
 * @auth public
 * @body {string} username - 登录用户名
 * @body {string} password - 登录密码
 * @body {string} confirmPassword - 确认密码
 * @body {string} email - 邮箱地址
 */
const register = async (ctx) => {
  const { username, password, email } = ctx.request.body

  const existedUser = await adminAuthDao.findAdminUserByUsername(username)
  if (existedUser) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userExist,
      msg: businessMsg[businessCode.userExist]
    }
    return
  }

  const existedEmail = await adminAuthDao.findAdminUserByEmail(email)
  if (existedEmail) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.emailExist,
      msg: businessMsg[businessCode.emailExist]
    }
    return
  }

  const defaultRole = await adminAuthDao.findRoleByName(defaultAdminRoleName)
  if (!defaultRole) {
    ctx.status = httpCode.internalServerError
    ctx.body = {
      code: businessCode.roleNotFound,
      msg: businessMsg[businessCode.roleNotFound]
    }
    return
  }

  const passwordHash = await hashPassword(password)
  const registerResult = await adminAuthDao.createAdminUser({
    username,
    email,
    passwordHash,
    roleId: defaultRole.roleId
  })

  if (registerResult.affectedRows !== 1) {
    ctx.status = httpCode.internalServerError
    ctx.body = {
      code: businessCode.error,
      msg: '注册失败'
    }
    return
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '注册成功',
    data: {
      username,
      email,
      roleName: defaultRole.roleName
    }
  }
}

/**
 * 后台登录 - 返回 token、用户信息、菜单和权限数据
 * @api POST /admin/auth/login
 * @description 后台认证
 * @auth public
 * @body {string} username - 登录用户名
 * @body {string} password - 登录密码
 */
const login = async (ctx) => {
  const { username, password } = ctx.request.body

  const user = await adminAuthDao.findAdminUserByUsername(username)
  if (!user) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  if (user.status !== 'active') {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.adminUserDisabled,
      msg: businessMsg[businessCode.adminUserDisabled]
    }
    return
  }

  const passwordMatched = await comparePassword(password, user.password)
  if (!passwordMatched) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  const permissionSnapshot = await buildPermissionSnapshot(user.roleId)
  const token = generateToken({
    userId: user.id,
    username: user.username,
    roleId: user.roleId,
    roleName: user.roleName
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '登录成功',
    data: {
      token,
      user: formatUserInfo(user),
      menus: permissionSnapshot.menuTree,
      permissions: permissionSnapshot.permissionCodes,
      buttons: permissionSnapshot.buttons
    }
  }
}

/**
 * 获取当前用户信息
 * @api GET /admin/auth/profile
 * @description 后台认证
 */
const getProfile = async (ctx) => {
  const currentUser = await adminAuthDao.findAdminUserById(ctx.state.user.userId)
  if (!currentUser) {
    ctx.status = httpCode.unauthorized
    ctx.body = {
      code: businessCode.userNotFound,
      msg: businessMsg[businessCode.userNotFound]
    }
    return
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取用户信息成功',
    data: formatUserInfo(currentUser)
  }
}

/**
 * 获取当前用户菜单
 * @api GET /admin/auth/menus
 * @description 后台认证
 */
const getMenus = async (ctx) => {
  const permissionSnapshot = await buildPermissionSnapshot(ctx.state.user.roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取菜单成功',
    data: permissionSnapshot.menuTree
  }
}

/**
 * 获取当前用户权限
 * @api GET /admin/auth/permissions
 * @description 后台认证
 */
const getPermissions = async (ctx) => {
  const permissionSnapshot = await buildPermissionSnapshot(ctx.state.user.roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取权限成功',
    data: {
      menus: permissionSnapshot.menuTree,
      buttons: permissionSnapshot.buttons,
      permissions: permissionSnapshot.permissionCodes
    }
  }
}

/**
 * 后台退出登录 - Token 加入 Redis 黑名单
 * @api POST /admin/auth/logout
 * @description 后台认证
 */
const logout = async (ctx) => {
  const token = ctx.state.token
  if (token) {
    try {
      const redis = getRedisClient()
      // 解析 token 过期时间，TTL 设为剩余有效期（最少 1 秒）
      const decoded = decodeToken(token)
      const exp = decoded?.exp
      const now = Math.floor(Date.now() / 1000)
      const ttl = exp ? Math.max(exp - now, 1) : 3600 // 无法解析则默认 1 小时
      await redis.setex(`blacklist:${token}`, ttl, '1')
    } catch {
      // 黑名单写入失败不影响退出响应，但记录日志
    }
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '退出成功'
  }
}

export default {
  register,
  login,
  getProfile,
  getMenus,
  getPermissions,
  logout
}
