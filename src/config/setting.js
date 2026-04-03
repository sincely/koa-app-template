import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
export const Port = Number.isFinite(portFromEnv) ? portFromEnv : 8080
export const staticDir = path.resolve(__dirname, '../../public')
export const uploadDir = path.join(__dirname, '../../public/')

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

export const TokenSecret = process.env.JWT_SECRET
export const TokenExpire = process.env.JWT_EXPIRES_IN || '7d'

const docsPortFromEnv = Number.parseInt(String(process.env.DOCS_PORT ?? ''), 10)
export const DocsPort = Number.isFinite(docsPortFromEnv) ? docsPortFromEnv : 4000
export const docsDir = path.resolve(__dirname, '../../docs')

const normalizePrefix = (value) => {
  const raw = String(value ?? '').trim()
  if (!raw) {
    return ''
  }
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash.slice(0, -1) : withLeadingSlash
}

export const DocsPrefix = normalizePrefix(process.env.DOCS_PREFIX) || '/docs'
