module.exports = {
  apps: [
    {
      name: 'koa-app-test',
      script: './dist/app.js',
      instances: 'max',
      //  测试用fork模式（方便debug）
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'test',
        PORT: 3001
      },
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'koa-app-prod',
      script: './dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'koa-worker-test',
      script: './src/worker.js',
      instances: 1, // Worker 通常不需要多实例，除非负载很高且任务无状态
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'test'
      },
      error_file: './logs/worker-err.log',
      out_file: './logs/worker-out.log'
    },
    {
      name: 'koa-worker-prod',
      script: './src/worker.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/worker-err.log',
      out_file: './logs/worker-out.log'
    }
  ]
}
