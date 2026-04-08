import mysql from 'mysql2/promise'
import { dbConfig } from '../config/database.js'

// 创建数据库连接
const pool = mysql.createPool(dbConfig)

/**
 * 执行 SQL 查询
 * @param {string} sql - SQL 语句
 * @param {Array} params - 查询参数
 * @returns {Promise} - 返回查询结果
 */
// 封装查询函数
const query = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params)
  return result
}

/**
 * 获取数据库连接（用于事务操作）
 * @returns {Promise} - 返回一个数据库连接
 */
const getConnection = async () => {
  return pool.getConnection()
}

export { query, getConnection }

export default { query, getConnection }
