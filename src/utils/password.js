import bcrypt from 'bcrypt'

/**
 * 加密密码
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 加密后的密码
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * 验证密码
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 加密后的密码
 * @returns {Promise<boolean>} 是否匹配
 */
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}
