import jwt from 'jsonwebtoken'
import { TokenSecret } from '../config/setting.js'

async function authenticate(ctx, next) {
  // 允许 session 作为兜底（与现有 app.js 的 session 体系兼容）
  if (ctx.session && ctx.session.user) {
    ctx.state.user = ctx.session.user
    await next()
    return
  }

  const xAccessToken = ctx.headers['x-access-token']
  const authHeader = ctx.headers.authorization
  const bearerToken = authHeader && authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : undefined
  const token = bearerToken || xAccessToken

  if (!token) {
    ctx.status = 401
    ctx.body = { message: 'Unauthorized' }
    return
  }

  try {
    const user = jwt.verify(token, TokenSecret)
    ctx.state.user = user
    await next()
  } catch {
    ctx.status = 401
    ctx.body = { message: 'Unauthorized' }
  }
}

export default authenticate
