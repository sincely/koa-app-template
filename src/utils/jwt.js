import jwt from 'jsonwebtoken'
import { TokenSecret, TokenExpire } from '../config/jwt.js'

/**
 * 生成 Token
 * @param {Object} payload - 要加密的数据
 * @returns {string} Token
 */
export function generateToken(payload) {
  return jwt.sign(payload, TokenSecret, {
    expiresIn: TokenExpire
  })
}

/**
 * 验证 Token
 * @param {string} token - Token
 * @returns {Object} 解密后的 payload
 * @throws {Error} TOKEN_EXPIRED | TOKEN_INVALID
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, TokenSecret)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Token 已过期，请重新登录')
      err.code = 'TOKEN_EXPIRED'
      err.status = 401
      throw err
    }
    const err = new Error('Token 无效')
    err.code = 'TOKEN_INVALID'
    err.status = 401
    throw err
  }
}

/**
 * 解码 Token（不验证）
 * @param {string} token - Token
 * @returns {Object|null} 解码后的数据或 null
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token)
  } catch {
    return null
  }
}
