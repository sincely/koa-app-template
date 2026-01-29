import mysql from 'mysql2/promise'

// 创建数据库连接
const pool = mysql.createPool({
  connectionLimit: 10, // 最大连接数，默认为10
  host: 'localhost', // 数据库服务器地址
  port: 3306, // 数据库端口
  waitForConnections: true, // 是否等待连接
  user: 'root', // 数据库的用户名
  password: '123456', // 数据库密码
  queueLimit: 0, // 最大等待连接数（0 表示不限制）
  database: 'web_antd' // 数据库名称
})

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
