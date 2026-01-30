import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

export const hashPassword = async (password, saltRounds = 10) => {
  return bcrypt.hash(password, saltRounds)
}

/**
 * 验证密码
 * @param {string} plainPassword - 用户输入的明文密码
 * @param {string} hashedPassword - 数据库中存储的加密密码
 * @returns {Promise<boolean>} - 密码是否匹配
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

// 生成 UUID
export const generateUUID = () => uuidv4()

// 格式化时间
export const formatTime = (date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date).format(format)
}

/**
 * 生成 JWT
 * @param {object} payload - 要编码的用户数据
 * @param {string} [expiresIn='1h'] - 令牌的有效期
 * @returns {string} - 生成的 JWT
 */
export const generateToken = (payload, expiresIn = '1h') => {
  const secretKey = process.env.JWT_SECRET || 'f7d623cd21149c493d7304960edaf2e10ad147528dbaf183520184fc0a0f64cb'
  return jwt.sign(payload, secretKey, { expiresIn })
}

/**
 * 验证 JWT
 * @param {string} token - 待验证的 JWT
 * @returns {object} - 解码后的用户数据
 * @throws {Error} - 如果验证失败
 */
export const verifyToken = (token) => {
  const secretKey = process.env.JWT_SECRET || 'f7d623cd21149c493d7304960edaf2e10ad147528dbaf183520184fc0a0f64cb' // 确保有密钥
  return jwt.verify(token, secretKey) // 解码并验证
}

export default {
  hashPassword,
  comparePassword,
  generateUUID,
  formatTime,
  generateToken,
  verifyToken
}
