/**
 * @module 用户模块
 * @description 处理用户相关的业务逻辑，包括登录、注册、查询用户名等功能
 */

import userDao from '../../models/dao/usersDao.js'
import { httpCode } from '../../config/httpError.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'

/**
 * @summary 用户登录
 * @description 验证用户名和密码，登录成功后将用户信息保存到 session
 * @api POST /user/login
 * @param {string} userName - 用户名（以字母开头，允许5-16字节，允许字母数字下划线）
 * @param {string} password - 密码（以字母开头，长度在6~18之间，只能包含字母、数字和下划线）
 * @returns {User} 200 - 登录成功返回用户信息
 */
const login = async (ctx) => {
  // 参数已由路由层 Zod 中间件校验，可直接使用
  const { username, password } = ctx.request.body

  // 连接数据库根据用户名和密码查询用户信息
  const user = await userDao.login(username, password)
  // 结果集长度为0则代表没有该用户
  if (user.length === 0) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
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

    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.success,
      user: loginUser,
      msg: '登录成功'
    }
    return
  }

  // 数据库设置用户名唯一
  // 若存在user.length != 1 || user.length!=0
  // 返回未知错误
  // 正常不会出现
  ctx.status = httpCode.internalServerError
  ctx.body = {
    code: businessCode.error,
    msg: '未知错误'
  }
}

/**
 * @summary 查询用户名是否存在
 * @description 查询数据库中是否已存在指定用户名，用于注册前的前端校验
 * @api POST /user/findUserName
 * @param {string} userName - 要查询的用户名
 * @returns {Object} 200 - 查询结果
 */
const findUserName = async (ctx) => {
  // 参数已由路由层 Zod 中间件校验
  const { username } = ctx.request.body

  // 连接数据库根据用户名查询用户信息
  const user = await userDao.findUserName(username)
  // 结果集长度为0则代表不存在该用户,可以注册
  if (user.length === 0) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.success,
      msg: '用户名不存在，可以注册'
    }
    return
  }

  // 数据库设置用户名唯一
  // 结果集长度为1则代表存在该用户,不可以注册
  if (user.length === 1) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userExist,
      msg: businessMsg[businessCode.userExist]
    }
    return
  }

  // 数据库设置用户名唯一，
  // 若存在user.length != 1 || user.length!=0
  // 返回未知错误
  // 正常不会出现
  ctx.status = httpCode.internalServerError
  ctx.body = {
    code: businessCode.error,
    msg: '未知错误'
  }
}

/**
 * @summary 用户注册
 * @description 注册新用户，会先检查用户名是否已存在，不存在则创建新用户
 * @api POST /user/register
 * @param {string} userName - 用户名（以字母开头，允许5-16字节，允许字母数字下划线）
 * @param {string} password - 密码（以字母开头，长度在6~18之间，只能包含字母、数字和下划线）
 * @returns {Object} 200 - 注册结果
 */
const register = async (ctx) => {
  // 参数已由路由层 Zod 中间件校验
  const { username, password } = ctx.request.body

  // 连接数据库根据用户名查询用户信息
  // 先判断该用户是否存在
  const user = await userDao.findUserName(username)

  if (user.length !== 0) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userExist,
      msg: businessMsg[businessCode.userExist]
    }
    return
  }

  // 连接数据库插入用户信息
  const registerResult = await userDao.register(username, password)
  // 操作所影响的记录行数为1,则代表注册成功
  if (registerResult.affectedRows === 1) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.success,
      msg: '注册成功'
    }
    return
  }
  // 否则失败
  ctx.status = httpCode.internalServerError
  ctx.body = {
    code: businessCode.error,
    msg: '未知错误，注册失败'
  }
}

export default {
  login,
  findUserName,
  register
}
