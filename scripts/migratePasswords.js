/**
 * 密码迁移脚本
 *
 * 用于将数据库中的明文密码迁移为 bcrypt 哈希密码
 *
 * 使用方法:
 *   node scripts/migratePasswords.js
 *
 * 注意:
 *   - 运行前请先备份数据库
 *   - 脚本会检测密码是否已经是 bcrypt 格式，避免重复加密
 */

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
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

import { db } from '../src/config/knex.js'
import { hashPassword } from '../src/utils/password.js'

/**
 * 检测密码是否已经是 bcrypt 格式
 * bcrypt 哈希以 $2a$, $2b$, 或 $2y$ 开头，长度为60字符
 */
function isBcryptHash(password) {
  if (!password || typeof password !== 'string') {
    return false
  }
  return /^\$2[aby]\$\d{2}\$.{53}$/.test(password)
}

async function migratePasswords() {
  console.log('🔄 开始密码迁移...\n')

  try {
    // 获取所有用户
    const users = await db('users').select('id', 'username', 'userName', 'password')

    console.log(`📊 找到 ${users.length} 个用户\n`)

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const user of users) {
      const userId = user.id
      const username = user.username || user.userName
      const password = user.password

      // 跳过已经是 bcrypt 格式的密码
      if (isBcryptHash(password)) {
        console.log(`⏭️  用户 [${username}] 密码已是加密格式，跳过`)
        skippedCount++
        continue
      }

      // 跳过空密码
      if (!password) {
        console.log(`⚠️  用户 [${username}] 密码为空，跳过`)
        skippedCount++
        continue
      }

      try {
        // 加密密码
        const hashedPassword = await hashPassword(password)

        // 更新数据库
        await db('users').where({ id: userId }).update({ password: hashedPassword })

        console.log(`✅ 用户 [${username}] 密码已迁移`)
        migratedCount++
      } catch (err) {
        console.error(`❌ 用户 [${username}] 迁移失败:`, err.message)
        errorCount++
      }
    }

    console.log('\n📈 迁移统计:')
    console.log(`   ✅ 成功迁移: ${migratedCount}`)
    console.log(`   ⏭️  已跳过: ${skippedCount}`)
    console.log(`   ❌ 失败: ${errorCount}`)
    console.log('\n🎉 密码迁移完成!')
  } catch (err) {
    console.error('❌ 迁移过程出错:', err)
    process.exit(1)
  } finally {
    // 关闭数据库连接
    await db.destroy()
  }
}

// 运行迁移
migratePasswords()
