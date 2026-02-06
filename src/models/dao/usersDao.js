import { db } from '../../config/knex.js'
import { hashPassword, comparePassword } from '../../utils/password.js'

/**
 * 用户登录 - 根据用户名查找用户并验证密码
 * @param {string} username - 用户名
 * @param {string} password - 明文密码
 * @returns {Promise<Array>} - 匹配的用户数组
 */
const login = async (username, password) => {
  // 支持两种字段名以兼容旧数据
  const user = await db('users')
    .where((builder) => {
      builder.where({ username }).orWhere({ userName: username })
    })
    .first()

  if (!user) {
    return []
  }
  const isMatch = await comparePassword(password, user.password)
  return isMatch ? [user] : []
}

/**
 * 查询用户名是否存在
 * @param {string} username - 用户名
 * @returns {Promise<Array>} - 用户数组
 */
const findUserName = async (username) => {
  // 支持两种字段名以兼容旧数据
  const users = await db('users').where((builder) => {
    builder.where({ username }).orWhere({ userName: username })
  })
  return users
}

/**
 * 用户注册 - 创建新用户（密码加密存储）
 * @param {string} username - 用户名
 * @param {string} password - 明文密码
 * @returns {Promise<Object>} - 包含 affectedRows 的结果对象
 */
const register = async (username, password) => {
  const hashedPassword = await hashPassword(password)
  const [id] = await db('users').insert({ username, password: hashedPassword })
  return { affectedRows: id ? 1 : 0 }
}

export default {
  login,
  findUserName,
  register
}
