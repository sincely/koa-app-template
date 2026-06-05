/**
 * 登录速率限制中间件（修复 #2）
 * 基于 Redis 滑动计数：IP + username 维度
 * 规则：60 秒窗口内最多 5 次失败 → 锁定 300 秒
 */
import { getRedisClient } from '../utils/redis.js'
import { createErrorResponse } from '../utils/createResponse.js'

const MAX_ATTEMPTS = 5 // 最大尝试次数
const WINDOW_SECONDS = 60 // 滑动窗口（秒）
const LOCKOUT_SECONDS = 300 // 锁定时长（5 分钟）

/**
 * 登录接口速率限制
 * 在 body parser 之后使用，读取 request.body.username
 */
export const loginRateLimiter = async (ctx, next) => {
  const redis = getRedisClient()
  const ip = ctx.ip || ctx.request.ip || 'unknown'
  const username = ctx.request.body?.username || ''

  // IP 维度锁定键
  const lockKey = `login:lock:${ip}:${username}`
  const countKey = `login:count:${ip}:${username}`

  // 检查是否已被锁定
  const isLocked = await redis.exists(lockKey)
  if (isLocked) {
    const ttl = await redis.ttl(lockKey)
    ctx.status = 429
    ctx.body = createErrorResponse(`登录尝试次数过多，请 ${Math.ceil(ttl / 60)} 分钟后再试`, 429)
    return
  }

  // 计数
  const count = await redis.incr(countKey)
  if (count === 1) {
    await redis.expire(countKey, WINDOW_SECONDS)
  }

  if (count > MAX_ATTEMPTS) {
    // 触发锁定
    await redis.setex(lockKey, LOCKOUT_SECONDS, '1')
    await redis.del(countKey)
    ctx.status = 429
    ctx.body = createErrorResponse(`登录尝试次数过多，账号已锁定 ${LOCKOUT_SECONDS / 60} 分钟`, 429)
    return
  }

  await next()

  // 登录成功时重置计数
  if (ctx.status === 200 && ctx.body?.code === 0) {
    await redis.del(countKey)
  }
}

export default loginRateLimiter
