// 示例定时任务处理器
export default async (job) => {
  const { message } = job.data
  console.log(`[${new Date().toISOString()}] Processing cron job: ${message}`)

  // 模拟耗时任务
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`[${new Date().toISOString()}] Job completed`)
  return { status: 'success', processedAt: new Date() }
}
