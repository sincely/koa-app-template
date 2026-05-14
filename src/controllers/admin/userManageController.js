/**
 * @module 用户管理
 * @description 处理后台用户管理相关的增删改查
 */

import adminUserDao from '../../services/adminUserDao.js'
import adminRoleDao from '../../services/adminRoleDao.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { httpCode } from '../../config/httpError.js'
import { hashPassword } from '../../utils/password.js'

/**
 * 获取用户列表 - 分页查询并返回角色选项
 * @api GET /admin/system/users
 * @description 用户管理 - 后台用户管理相关的增删改查
 * @query {integer} page - 当前页码
 * @query {integer} pageSize - 每页数量
 * @query {string} [keyword] - 用户名或邮箱关键词
 * @query {string} [status] - 用户状态
 * @query {integer} [roleId] - 角色 ID
 */
const listUsers = async (ctx) => {
  const { page, pageSize, keyword, status, roleId } = ctx.query
  const [list, total, roleOptions] = await Promise.all([
    adminUserDao.listUsers({ page, pageSize, keyword, status, roleId }),
    adminUserDao.countUsers({ keyword, status, roleId }),
    adminUserDao.listRoleOptions()
  ])

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取用户列表成功',
    data: {
      list,
      roleOptions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }
}

/**
 * 创建用户 - 新增后台用户并绑定角色
 * @api POST /admin/system/users
 * @description 用户管理
 * @body {string} username - 用户名
 * @body {string} password - 登录密码
 * @body {string} [gender] - 性别
 * @body {integer} [age] - 年龄
 * @body {string} [idCard] - 身份证号
 * @body {string} email - 邮箱地址
 * @body {string} [address] - 联系地址
 * @body {string} [status] - 用户状态
 * @body {string} [avatar] - 头像地址
 * @body {integer} roleId - 角色 ID
 */
const createUser = async (ctx) => {
  const { username, password, gender, age, idCard, email, address, status, avatar, roleId } = ctx.request.body

  const [existedUser, existedEmail, existedIdCard, role] = await Promise.all([
    adminUserDao.findUserByUsername(username),
    adminUserDao.findUserByEmail(email),
    adminUserDao.findUserByIdCard(idCard),
    adminRoleDao.findRoleById(roleId)
  ])

  if (existedUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userExist, msg: businessMsg[businessCode.userExist] }
    return
  }

  if (existedEmail) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.emailExist, msg: businessMsg[businessCode.emailExist] }
    return
  }

  if (existedIdCard) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.idCardExist, msg: businessMsg[businessCode.idCardExist] }
    return
  }

  if (!role) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const passwordHash = await hashPassword(password)
  const result = await adminUserDao.createUser({
    username,
    gender,
    age: age ?? null,
    idCard,
    email,
    address: address ?? null,
    status,
    avatar: avatar ?? null,
    roleId,
    passwordHash
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '创建用户成功',
    data: {
      id: result.insertId
    }
  }
}

/**
 * 更新用户 - 更新资料、角色或密码
 * @api PUT /admin/system/users
 * @description 用户管理
 * @body {integer} id - 用户 ID
 * @body {string} [password] - 新密码
 * @body {string} [gender] - 性别
 * @body {integer} [age] - 年龄
 * @body {string} [idCard] - 身份证号
 * @body {string} [email] - 邮箱地址
 * @body {string} [address] - 联系地址
 * @body {string} [status] - 用户状态
 * @body {string} [avatar] - 头像地址
 * @body {integer} [roleId] - 角色 ID
 */
const updateUser = async (ctx) => {
  const { id, password, email, idCard, roleId, ...rest } = ctx.request.body
  const currentUser = await adminUserDao.findUserById(id)

  if (!currentUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userNotFound, msg: businessMsg[businessCode.userNotFound] }
    return
  }

  if (email) {
    const existedEmail = await adminUserDao.findUserByEmail(email)
    if (existedEmail && existedEmail.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.emailExist, msg: businessMsg[businessCode.emailExist] }
      return
    }
  }

  if (idCard) {
    const existedIdCard = await adminUserDao.findUserByIdCard(idCard)
    if (existedIdCard && existedIdCard.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.idCardExist, msg: businessMsg[businessCode.idCardExist] }
      return
    }
  }

  if (roleId) {
    const role = await adminRoleDao.findRoleById(roleId)
    if (!role) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
      return
    }
  }

  const payload = { ...rest }
  if (email !== undefined) {
    payload.email = email
  }
  if (idCard !== undefined) {
    payload.idCard = idCard
  }
  if (roleId !== undefined) {
    payload.roleId = roleId
  }
  if (password) {
    payload.password = await hashPassword(password)
  }

  await adminUserDao.updateUser(id, payload)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新用户成功'
  }
}

/**
 * 删除用户
 * @api DELETE /admin/system/users
 * @description 用户管理
 * @body {integer} id - 用户 ID
 */
const deleteUser = async (ctx) => {
  const { id } = ctx.request.body

  if (ctx.state.user.userId === id) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userDeleteSelfDenied,
      msg: businessMsg[businessCode.userDeleteSelfDenied]
    }
    return
  }

  const currentUser = await adminUserDao.findUserById(id)
  if (!currentUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userNotFound, msg: businessMsg[businessCode.userNotFound] }
    return
  }

  await adminUserDao.deleteUser(id)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除用户成功'
  }
}

export default {
  listUsers,
  createUser,
  updateUser,
  deleteUser
}
