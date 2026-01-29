async function responseFormatter(ctx, next) {
  try {
    await next()

    if (ctx.body) {
      ctx.body = {
        code: 200,
        msg: 'Success',
        data: ctx.body
      }
    } else {
      ctx.body = {
        code: 404,
        msg: 'Not Found',
        data: null
      }
    }
  } catch (error) {
    ctx.status = error.status || 500
    ctx.body = {
      code: ctx.status,
      msg: error.message || 'Internal Server Error',
      data: null
    }
    ctx.app.emit('error', error, ctx)
  }
}

export default responseFormatter
