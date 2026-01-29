import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 在读取任何 process.env 之前加载环境变量文件
const nodeEnv = process.env.NODE_ENV || 'development'
const envFilePath = path.resolve(process.cwd(), `.env.${nodeEnv}`)
const fallbackEnvPath = path.resolve(process.cwd(), '.env')

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath })
} else if (fs.existsSync(fallbackEnvPath)) {
  dotenv.config({ path: fallbackEnvPath })
} else {
  dotenv.config()
}

const portFromEnv = Number.parseInt(String(process.env.PORT ?? ''), 10)
export const Port = Number.isFinite(portFromEnv) ? portFromEnv : 8080 // 启动端口
export const staticDir = path.resolve(__dirname, '../../public') // 静态资源路径
export const uploadDir = path.join(__dirname, '../../public/') // 上传文件路径
// 数据库连接设置
export const dbConfig = {
  connectionLimit: 10, // 最大连接数，默认为10
  host: process.env.DB_HOST, // 数据库服务器地址
  port: 3306, // 数据库端口
  waitForConnections: true, // 是否等待连接
  user: process.env.DB_USER, // 数据库的用户名
  password: process.env.DB_PASSWORD, // 数据库密码
  queueLimit: 0, // 最大等待连接数（0 表示不限制）
  database: process.env.DB_NAME // 数据库名称
}

export const TokenSecret = 'koa-app-template-secret'
export const TokenExpire = '1h'
