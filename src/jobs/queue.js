import Queue from 'bull'
import { redisConfig } from '../config/database.js'

// 创建一个通用队列实例
// 这里创建一个名为 'cron-jobs' 的队列
const cronQueue = new Queue('cron-jobs', {
  redis: redisConfig
})

export { cronQueue }
