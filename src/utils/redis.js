/**
 * Redis 单例客户端
 * 复用 ioredis 连接，避免每个模块各自创建连接
 */
import Redis from 'ioredis'
import { redisConfig } from '../config/database.js'
import logger from '../config/logger.js'

let client = null

/**
 * 获取 Redis 客户端单例
 * @returns {Redis}
 */
export function getRedisClient() {
  if (!client) {
    client = new Redis(redisConfig)

    client.on('connect', () => {
      logger.info('Redis 连接成功')
    })

    client.on('error', (err) => {
      logger.error({ err }, 'Redis 连接错误')
    })

    client.on('close', () => {
      logger.warn('Redis 连接已关闭')
    })
  }
  return client
}

/**
 * 优雅关闭 Redis 连接（供 graceful shutdown 使用）
 */
export async function closeRedisClient() {
  if (client) {
    await client.quit()
    client = null
    logger.info('Redis 连接已关闭')
  }
}

export default getRedisClient
