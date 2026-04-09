import { cronQueue } from './jobs/queue.js'
import exampleTaskProcessor from './jobs/processors/exampleTask.js'
import { initScheduler } from './jobs/scheduler.js'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

// 确保环境变量被加载 (与 config/env.js 保持一致)
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

console.log(`Starting worker in ${nodeEnv} mode...`)

// 初始化定时任务
initScheduler().catch((err) => {
  console.error('Failed to initialize scheduler:', err)
})

// 处理任务
// 并发数设置为 2
cronQueue.process(2, exampleTaskProcessor)

// 监听队列事件
cronQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result)
})

cronQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err)
})

console.log('Worker is running and listening for jobs...')
