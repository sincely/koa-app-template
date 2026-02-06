import knex from 'knex'
import { dbConfig } from './setting.js'

const isDev = process.env.NODE_ENV === 'development'

const setup = {
  client: 'mysql2',
  connection: {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port || 3306
  },
  pool: {
    min: 2,
    max: dbConfig.connectionLimit || 10
  },
  // 开发环境启用 SQL 日志
  debug: isDev
}

export const knexSetup = setup
export const db = knex(setup)

// 自定义 SQL 日志格式 (可选)
if (isDev) {
  db.on('query', (query) => {
    console.log('📝 SQL:', query.sql)
    if (query.bindings?.length) {
      console.log('   参数:', query.bindings)
    }
  })
}
