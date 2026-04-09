import path from 'path'
import { fileURLToPath } from 'url'
import './env.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const portFromEnv = Number.parseInt(String(process.env.PORT ?? ''), 10)
export const Port = Number.isFinite(portFromEnv) ? portFromEnv : 8080
export const staticDir = path.resolve(__dirname, '../../public')
export const uploadDir = path.join(__dirname, '../../public/')
