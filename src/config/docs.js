import path from 'path'
import { fileURLToPath } from 'url'
import './env.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
