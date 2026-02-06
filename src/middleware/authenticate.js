import { verifyToken } from '../utils/jwt.js'
import { createErrorResponse } from '../utils/createResponse.js'

async function authenticate(ctx, next) {
  // 从请求头获取 Token
  const authorization = ctx.headers.authorization

  if (!authorization) {
    ctx.status = 401
    ctx.body = createErrorResponse('未登录或登录已过期', 401)
    return
  }

  // 校验 Token 格式 (Bearer <token>)
  const token = authorization && authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7) : undefined
  if (!token) {
    ctx.status = 401
    ctx.body = createErrorResponse('Token 格式错误', 401)
    return
  }

  // 验证 Token
  const decoded = verifyToken(token)
  if (!decoded) {
    ctx.status = 401
    ctx.body = createErrorResponse('Token 无效或已过期', 401)
    return
  }
  // 将解码后的用户信息存储在 ctx.state.user 中，供后续中间件和路由使用
  ctx.state.user = decoded
  await next()
}

export default authenticate
