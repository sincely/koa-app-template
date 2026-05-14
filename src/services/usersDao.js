import { query } from '../utils/db.js'
/**
 * 用户登录 - 根据用户名查找用户并验证密码
 * @param {string} username - 用户名
 * @param {string} password - 明文密码
 * @returns {Promise<Array>} - 匹配的用户数组
 */
const login = async (username, password) => {
  const sql = 'select * from users where userName = ? and password = ?'
  return await query(sql, [username, password])
}

/**
 * 查询用户名是否存在
 * @param {string} username - 用户名
 * @returns {Promise<Array>} - 用户数组
 */
const findUserName = async (username) => {
  const sql = 'select * from users where userName = ?'
  return await query(sql, [username])
}

/**
 * 用户注册 - 创建新用户（密码加密存储）
 * @param {string} username - 用户名
 * @param {string} password - 明文密码
 * @returns {Promise<Object>} - 包含 affectedRows 的结果对象
 */
const register = async (username, password) => {
  const sql = 'select * from users where userName = ?'
  return await query(sql, [username])
}

export default {
  login,
  findUserName,
  register
}
