import { HTTP_CODE } from '../config/httpError.js'
import { BUSINESS_CODE, BUSINESS_MSG } from '../config/businessCode.js'

/**
 * 校验用户信息是否符合规则
 * @param {Object} ctx
 * @param {string} userName
 * @param {string} password
 * @return {boolean}
 */
export const checkUserInfo = (ctx, userName = '', password = '') => {
  if (userName.length === 0 || password.length === 0) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.USER_PARAM_MISSING,
      msg: BUSINESS_MSG[BUSINESS_CODE.USER_PARAM_MISSING]
    }
    return false
  }
  const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
  if (!userNameRule.test(userName)) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.USER_NAME_INVALID,
      msg: BUSINESS_MSG[BUSINESS_CODE.USER_NAME_INVALID]
    }
    return false
  }
  const passwordRule = /^[a-zA-Z]\w{5,17}$/
  if (!passwordRule.test(password)) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.PASSWORD_INVALID,
      msg: BUSINESS_MSG[BUSINESS_CODE.PASSWORD_INVALID]
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
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.USER_PARAM_MISSING,
      msg: '用户名不能为空'
    }
    return false
  }
  const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
  if (!userNameRule.test(userName)) {
    ctx.status = HTTP_CODE.OK
    ctx.body = {
      code: BUSINESS_CODE.USER_NAME_INVALID,
      msg: BUSINESS_MSG[BUSINESS_CODE.USER_NAME_INVALID]
    }
    return false
  }
  return true
}
