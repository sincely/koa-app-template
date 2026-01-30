// 权限中间件
import db from '../utils/db.js'

const cache = new Map()
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000 // 缓存有效期为 10 分钟

const setCache = (roleId, data) => {
  const expirationTime = Date.now() + CACHE_EXPIRATION_TIME
  cache.set(roleId, { data, expirationTime })
}

const getCache = (roleId) => {
  const cached = cache.get(roleId)
  if (cached && cached.expirationTime > Date.now()) {
    return cached.data
  }
  cache.delete(roleId)
  return null
}

async function permissions(ctx, next) {
  const user = ctx.state.user
  if (user) {
    let allowedPaths = getCache(user.roleId)
    if (!allowedPaths) {
      const [rows] = await db.query(
        `
        SELECT path FROM RouteAuth
        JOIN RoleRoute ON RouteAuth.id = RoleRoute.routeId
        WHERE RoleRoute.roleId = ?
      `,
        [user.roleId]
      )
      allowedPaths = rows.map((row) => row.path)
      setCache(user.roleId, allowedPaths)
    }
    if (allowedPaths.includes(ctx.path)) {
      await next()
    } else {
      ctx.status = 403
      ctx.body = { message: 'Access forbidden: insufficient permissions' }
    }
  } else {
    ctx.status = 403
    ctx.body = { message: 'Access forbidden: no user found' }
  }
  // SELECT path FROM RouteAuth
  // JOIN RoleRoute ON RouteAuth.id = RoleRoute.routeId
  // WHERE RoleRoute.roleId = 1
}

export default permissions
