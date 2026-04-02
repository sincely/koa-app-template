import mysql from 'mysql2/promise'
import { dbConfig } from '../config/setting.js'
import { db } from '@/config/knex.js'

// 创建数据库连接
const pool = mysql.createPool(dbConfig)

/**
 * 执行 SQL 查询
 * @param {string} sql - SQL 语句
 * @param {Array} params - 查询参数
 * @returns {Promise} - 返回查询结果
 */
// 封装查询函数
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
        return
      }
      connection.query(sql, params, (error, results) => {
        connection.release() // 释放连接
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  })
}

/**
 * 获取数据库连接（用于事务操作）
 * @returns {Promise} - 返回一个数据库连接
 */
const getConnection = () => {
  console.log(`✅ 数据库连接成功（环境：${env}，数据库：${dbConfig.database}`)
  return pool.getConnection()
}

export { query, getConnection }

export default { query, getConnection }
