import pino from 'pino'
console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
const isDev = process.env.NODE_ENV === 'development'

const logger = pino({
  level: isDev ? 'debug' : 'info',
  hooks: {
    logMethod(inputArgs, method, level) {
      const levelIcons = {
        10: '🔍', // TRACE
        20: '🐛', // DEBUG
        30: '🚀', // INFO
        40: '⚠️', // WARN
        50: '🚨', // ERROR
        60: '💀' // FATAL
      }
      const icon = levelIcons[level] || '📝'

      // Handle case: logger.info('message')
      if (typeof inputArgs[0] === 'string') {
        inputArgs[0] = `${icon} ${inputArgs[0]}`
      } else if (typeof inputArgs[0] === 'object' && typeof inputArgs[1] === 'string') {
        // Handle case: logger.info({ obj }, 'message')
        inputArgs[1] = `${icon} ${inputArgs[1]}`
      }

      return method.apply(this, inputArgs)
    }
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    : undefined,
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort
      }
    },
    res(res) {
      return {
        statusCode: res.statusCode
      }
    },
    err: pino.stdSerializers.err
  }
})

export default logger

// Create a child logger with additional context
export function createLogger(context) {
  return logger.child(context)
}
