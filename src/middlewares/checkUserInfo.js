import { httpCode } from '../config/httpError.js'
import { businessCode, businessMsg } from '../config/businessCode.js'

/**
 * 校验用户信息是否符合规则
 * @param {Object} ctx
 * @param {string} userName
 * @param {string} password
 * @return {boolean}
 */
export const checkUserInfo = (ctx, userName = '', password = '') => {
  if (userName.length === 0 || password.length === 0) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userParamMissing,
      msg: businessMsg[businessCode.userParamMissing]
    }
    return false
  }
  const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
  if (!userNameRule.test(userName)) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userNameInvalid,
      msg: businessMsg[businessCode.userNameInvalid]
    }
    return false
  }
  const passwordRule = /^[a-zA-Z]\w{5,17}$/
  if (!passwordRule.test(password)) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.passwordInvalid,
      msg: businessMsg[businessCode.passwordInvalid]
    }
    return false
  }
  return true
}

/**
 * 校验用户名是否符合规则
 * @param {Object} ctx
 * @param {string} userName
 * @return {boolean}
 */
export const checkUserName = (ctx, userName = '') => {
  if (userName.length === 0) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userParamMissing,
      msg: '用户名不能为空'
    }
    return false
  }
  const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
  if (!userNameRule.test(userName)) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userNameInvalid,
      msg: businessMsg[businessCode.userNameInvalid]
    }
    return false
  }
  return true
}
