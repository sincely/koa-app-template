export default {
  origin: function (ctx) {
    // 允许的源
    if (process.env.NODE_ENV === 'development') {
      return '*'
    }
    return '*'
    // 生产环境下建议配置具体的白名单域名
    // const whiteList = ['https://yourdomain.com', 'https://admin.yourdomain.com']
    // const origin = ctx.get('Origin')
    // if (whiteList.includes(origin)) {
    //   return origin
    // }
    // return false // 不在白名单内的拒绝跨域
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5, // 预检请求（OPTIONS）的有效期（秒），避免频繁发送预检请求
  credentials: true, // 允许发送 cookies
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'], // 允许的请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-access-token'] // 允许的请求头
}
