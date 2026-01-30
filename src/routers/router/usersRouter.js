import Router from 'koa-router'
// 导入控制层
import User from '../../controllers/usersController.js'

const usersRouter = new Router()

usersRouter
  .post('/users/login', User.login)
  .post('/users/findUserName', User.findUserName)
  .post('/users/register', User.register)

export default usersRouter
