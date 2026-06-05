import adminPermissionDao from '../services/adminPermissionDao.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { createErrorResponse } from '../utils/createResponse.js'
import { httpCode } from '../config/httpError.js'
import { getRedisClient } from '../utils/redis.js'

/** 角色权限缓存 TTL（秒），默认 5 分钟 */
const PERM_CACHE_TTL = 300

/**
 * 获取角色菜单（带 Redis 缓存）
 * 角色权限变更时应主动调用 invalidateRolePermissionCache 清除缓存
 * @param {number|string} roleId
 */
async function getMenusByRoleId(roleId) {
  const redis = getRedisClient()
  const cacheKey = `perm:role:${roleId}:menus`
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  const menus = await adminPermissionDao.findMenusByRoleId(roleId)
  await redis.setex(cacheKey, PERM_CACHE_TTL, JSON.stringify(menus))
  return menus
}

/**
 * 主动清除角色权限缓存（角色权限变更时调用）
 * @param {number|string} roleId
 */
export async function invalidateRolePermissionCache(roleId) {
  const redis = getRedisClient()
  await redis.del(`perm:role:${roleId}:menus`)
}

export const authorizeRoute = (routePath) => {
  return async (ctx, next) => {
    const currentUser = ctx.state.user

    if (!currentUser?.roleId) {
      ctx.status = httpCode.unauthorized
      ctx.body = createErrorResponse('未登录或登录已过期', ctx.status)
      return
    }

    if (currentUser.roleName === 'admin') {
      await next()
      return
    }

    const menus = await getMenusByRoleId(currentUser.roleId)
    const allowed = menus.some((menu) => menu.path === routePath)

    if (!allowed) {
      ctx.status = httpCode.forbidden
      ctx.body = {
        code: businessCode.permissionDenied,
        msg: businessMsg[businessCode.permissionDenied]
      }
      return
    }

    await next()
  }
}

export default authorizeRoute
