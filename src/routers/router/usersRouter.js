import Router from 'koa-router'
// 导入控制层
import { Login, FindUserName, Register } from '../../controllers/usersController.js'

const usersRouter = new Router()
usersRouter
  .post('/users/login', Login)
  .post('/users/findUserName', FindUserName)
  .post('/users/register', Register)

export default usersRouter
