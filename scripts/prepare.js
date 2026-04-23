import { execSync } from 'child_process'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  process.exit(0)
}

execSync('husky install', { stdio: 'inherit' })
