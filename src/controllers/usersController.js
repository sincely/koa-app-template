import userDao from '../models/dao/usersDao.js'
import { validateParams } from '../utils/validateParams.js'
import { HTTP_CODE } from '../config/httpError.js'
import { BUSINESS_CODE, BUSINESS_MSG } from '../config/businessCode.js'
import { userSchema, userNameSchema } from '../validators/usersValidator.js'

const login = async (ctx) => {
  const { userName, password } = ctx.request.body

  // 校验用户信息是否符合规则
  const error = validateParams(userSchema, { userName, password })
  if (error) {
    ctx.status = HTTP_CODE.OK
    ctx.body = error
    return
  }

  // 连接数据库根据用户名和密码查询用户信息
  const user = await userDao.login(userName, password)
  // 结果集长度为0则代表没有该用户
  if (user.length === 0) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.USER_LOGIN_FAIL,
      msg: BUSINESS_MSG[BUSINESS_CODE.USER_LOGIN_FAIL]
    }
    return
  }

  // 数据库设置用户名唯一
  // 结果集长度为1则代表存在该用户
  if (user.length === 1) {
    const loginUser = {
      user_id: user[0].user_id,
      userName: user[0].userName
    }
    // 保存用户信息到session
    ctx.session.user = loginUser

    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.SUCCESS,
      user: loginUser,
      msg: '登录成功'
    }
    return
  }

  // 数据库设置用户名唯一
  // 若存在user.length != 1 || user.length!=0
  // 返回未知错误
  // 正常不会出现
  ctx.status = HTTP_CODE.INTERNAL_SERVER_ERROR
  ctx.body = {
    code: BUSINESS_CODE.ERROR,
    msg: '未知错误'
  }
}

/**
 * 查询是否存在某个用户名,用于注册时前端校验
 * @param {Object} ctx
 */
const findUserName = async (ctx) => {
  const { userName } = ctx.request.body

  // 校验用户名是否符合规则
  const error = validateParams(userNameSchema, { userName })
  if (error) {
    ctx.status = HTTP_CODE.OK
    ctx.body = error
    return
  }

  // 连接数据库根据用户名查询用户信息
  const user = await userDao.findUserName(userName)
  // 结果集长度为0则代表不存在该用户,可以注册
  if (user.length === 0) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.SUCCESS,
      msg: '用户名不存在，可以注册'
    }
    return
  }

  // 数据库设置用户名唯一
  // 结果集长度为1则代表存在该用户,不可以注册
  if (user.length === 1) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.USER_EXIST,
      msg: BUSINESS_MSG[BUSINESS_CODE.USER_EXIST]
    }
    return
  }

  // 数据库设置用户名唯一，
  // 若存在user.length != 1 || user.length!=0
  // 返回未知错误
  // 正常不会出现
  ctx.status = HTTP_CODE.INTERNAL_SERVER_ERROR
  ctx.body = {
    code: BUSINESS_CODE.ERROR,
    msg: '未知错误'
  }
}

const register = async (ctx) => {
  const { userName, password } = ctx.request.body

  // 校验用户信息是否符合规则
  const error = validateParams(userSchema, { userName, password })
  if (error) {
    ctx.status = HTTP_CODE.OK
    ctx.body = error
    return
  }

  // 连接数据库根据用户名查询用户信息
  // 先判断该用户是否存在
  const user = await userDao.findUserName(userName)

  if (user.length !== 0) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.USER_EXIST,
      msg: BUSINESS_MSG[BUSINESS_CODE.USER_EXIST]
    }
    return
  }

  // 连接数据库插入用户信息
  const registerResult = await userDao.register(userName, password)
  // 操作所影响的记录行数为1,则代表注册成功
  if (registerResult.affectedRows === 1) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.SUCCESS,
      msg: '注册成功'
    }
    return
  }
  // 否则失败
  ctx.status = HTTP_CODE.INTERNAL_SERVER_ERROR
  ctx.body = {
    code: BUSINESS_CODE.ERROR,
    msg: '未知错误，注册失败'
  }
}

export default {
  login,
  findUserName,
  register
}
