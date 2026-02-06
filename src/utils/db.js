import mysql from 'mysql2/promise'
import { dbConfig } from '../config/setting.js'

// 创建数据库连接
const pool = mysql.createPool(dbConfig)

/**
 * 执行 SQL 查询
 * @param {string} sql - SQL 语句
 * @param {Array} params - 查询参数
 * @returns {Promise} - 返回查询结果
 */
// 封装查询函数
async function query(sql, params) {
  const connection = await pool.getConnection()
  try {
    const [rows, fields] = await connection.execute(sql, params)
    return rows
  } finally {
    connection.release()
  }
}

/**
 * 获取数据库连接（用于事务操作）
 * @returns {Promise} - 返回一个数据库连接
 */
async function getConnection() {
  const connection = await pool.getConnection()
  // console.log(`✅ 数据库连接成功（环境：${env}，数据库：${dbConfig.database}`)
  return connection
}

export default {
  query,
  getConnection
}
