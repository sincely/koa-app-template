import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const srcDir = path.join(rootDir, 'src')
const deployFileNames = [
  'ecosystem.config.cjs',
  'package.json',
  // 'package-lock.json',
  '.env.development',
  '.env.test',
  '.env.production'
]
const distInstallScriptSource = path.join(rootDir, 'scripts', 'install-start-dist.sh')
const distInstallScriptTarget = path.join(distDir, 'install-start.sh')
const distEcosystemConfigPath = path.join(distDir, 'ecosystem.config.cjs')

function rmDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function copyFileIfExists(fileName) {
  const sourcePath = path.join(rootDir, fileName)
  if (!fs.existsSync(sourcePath)) {
    return
  }
  fs.copyFileSync(sourcePath, path.join(distDir, fileName))
}

console.log('Building...')
rmDir(distDir)
copyDir(srcDir, distDir)
for (const fileName of deployFileNames) {
  copyFileIfExists(fileName)
}
if (fs.existsSync(distEcosystemConfigPath)) {
  const ecosystemContent = fs.readFileSync(distEcosystemConfigPath, 'utf8')
  const distEcosystemContent = ecosystemContent
    .replaceAll('./dist/app.js', './app.js')
    .replaceAll('./src/worker.js', './worker.js')
  fs.writeFileSync(distEcosystemConfigPath, distEcosystemContent)
}
if (fs.existsSync(distInstallScriptSource)) {
  fs.copyFileSync(distInstallScriptSource, distInstallScriptTarget)
}
console.log('Build complete.')
