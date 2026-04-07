import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 计算脚本所在目录与项目根目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// 构建输入与输出目录
const distDir = path.join(rootDir, 'dist')
const srcDir = path.join(rootDir, 'src')

// 发布包额外携带文件：
// - ecosystem.config.cjs：PM2 启动配置
// - package.json：安装生产依赖必需
// - .env.*：按环境加载配置
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

// 删除目录（存在时递归删除）
function rmDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
}

// 递归复制目录
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

// 若文件存在则复制到 dist 根目录
function copyFileIfExists(fileName) {
  const sourcePath = path.join(rootDir, fileName)
  if (!fs.existsSync(sourcePath)) {
    return
  }
  fs.copyFileSync(sourcePath, path.join(distDir, fileName))
}

// 构建流程：
// 1) 清空旧 dist
// 2) 复制 src 到 dist
// 3) 复制部署所需附加文件
// 4) 重写 ecosystem 中路径（适配在 dist 目录内运行）
// 5) 复制安装启动脚本到 dist/install-start.sh
console.log('Building...')
rmDir(distDir)
copyDir(srcDir, distDir)
for (const fileName of deployFileNames) {
  copyFileIfExists(fileName)
}

// 根目录 ecosystem 中脚本路径是 ./dist/app.js、./src/worker.js
// 发布后在 dist 中执行，需改为 ./app.js、./worker.js
if (fs.existsSync(distEcosystemConfigPath)) {
  const ecosystemContent = fs.readFileSync(distEcosystemConfigPath, 'utf8')
  const distEcosystemContent = ecosystemContent
    .replaceAll('./dist/app.js', './app.js')
    .replaceAll('./src/worker.js', './worker.js')
  fs.writeFileSync(distEcosystemConfigPath, distEcosystemContent)
}

// 复制部署脚本，发布后可直接执行 ./install-start.sh
if (fs.existsSync(distInstallScriptSource)) {
  fs.copyFileSync(distInstallScriptSource, distInstallScriptTarget)
}
console.log('Build complete.')
