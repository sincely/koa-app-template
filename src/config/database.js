import './env.js'

export const dbConfig = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: 3306,
  waitForConnections: true,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  queueLimit: 0,
  database: process.env.DB_NAME
}

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || null,
  db: Number.parseInt(process.env.REDIS_DB || '0', 10)
}
