import { verifyToken } from '../utils/jwt.js'
import { createErrorResponse } from '../utils/createResponse.js'
import { getRedisClient } from '../utils/redis.js'

async function authenticate(ctx, next) {
  // 从请求头获取 Token
  const authorization = ctx.headers.authorization

  if (!authorization) {
    ctx.status = 401
    ctx.body = createErrorResponse('未登录或登录已过期', 401)
    return
  }

  // 校验 Token 格式 (Bearer <token>)
  const token = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7) : undefined
  if (!token) {
    ctx.status = 401
    ctx.body = createErrorResponse('Token 格式错误，应为 Bearer <token>', 401)
    return
  }

  // 检查 Token 是否在黑名单中（已登出）
  const redis = getRedisClient()
  const isBlacklisted = await redis.exists(`blacklist:${token}`)
  if (isBlacklisted) {
    ctx.status = 401
    ctx.body = createErrorResponse('Token 已失效，请重新登录', 401)
    return
  }

  // 验证 Token（verifyToken 现在会抛出带 code 的错误）
  let decoded
  try {
    decoded = verifyToken(token)
  } catch (err) {
    ctx.status = 401
    ctx.body = createErrorResponse(err.message, 401)
    // 把 code 也透传给前端（TOKEN_EXPIRED / TOKEN_INVALID）
    ctx.body.code = err.code
    return
  }

  // 将解码后的用户信息存储在 ctx.state.user 中，供后续中间件和路由使用
  ctx.state.user = decoded
  // 存储原始 token，供 logout 等接口使用
  ctx.state.token = token
  await next()
}

export default authenticate
