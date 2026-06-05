/**
 * RequestId 中间件
 * - 从请求头 X-Request-Id 读取（支持上游网关传入）
 * - 若无则自动生成 UUID
 * - 注入到 ctx.state.requestId 和响应头 X-Request-Id
 * - 便于日志链路追踪
 */
import { randomUUID } from 'node:crypto'

export default async function requestId(ctx, next) {
  const id = ctx.headers['x-request-id'] || randomUUID()
  ctx.state.requestId = id
  // 响应头下发，方便前端/网关关联日志
  ctx.set('X-Request-Id', id)
  await next()
}
