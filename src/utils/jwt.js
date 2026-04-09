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
 * @returns {Object|null} 解密后的数据或 null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, TokenSecret)
  } catch (error) {
    return null
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
  } catch (error) {
    return null
  }
}
