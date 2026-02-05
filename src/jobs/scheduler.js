import { cronQueue } from './queue.js'

export const initScheduler = async () => {
  console.log('Initializing scheduler...')

  // 添加一个每分钟执行一次的任务
  // repeat: { cron: '* * * * *' } 表示每分钟执行
  await cronQueue.add(
    { message: 'Every minute task' },
    {
      repeat: { cron: '* * * * *' },
      jobId: 'every-minute-job' // 确保 Job ID 固定，避免重复添加
    }
  )

  console.log('Scheduler initialized. Repeated jobs added.')
}
