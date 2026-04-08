import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

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
