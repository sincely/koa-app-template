import jwt from 'jsonwebtoken'
import { TokenSecret } from '../config/setting.js'

async function authenticate(ctx, next) {
  const token = ctx.headers['x-access-token']

  if (token) {
    const user = jwt.verify(token, TokenSecret)
    ctx.state.user = user
    await next()
  } else {
    ctx.status = 401
    ctx.body = { message: 'Unauthorized' }
  }
}

// 受保护的路由
// router.get('/protected', authenticate, async (ctx) => {
//     ctx.body = { message: 'You have access to this protected route', user: ctx.state.user };
//   });

export default authenticate
