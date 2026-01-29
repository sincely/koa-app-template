/**
 * 业务错误码
 * 区分于 HTTP Status Code
 * 0: 成功
 * 100xx: 用户模块错误
 * 200xx: 系统模块错误
 */
export const BUSINESS_CODE = {
  // 全局
  SUCCESS: 0,
  ERROR: 1,
  PARAM_ERROR: 2, // 参数错误

  // 用户模块
  USER_PARAM_MISSING: 10001, // 用户名或密码为空
  USER_NAME_INVALID: 10002, // 用户名格式错误
  PASSWORD_INVALID: 10003, // 密码格式错误
  USER_NOT_FOUND: 10004, // 用户不存在
  USER_EXIST: 10005, // 用户已存在
  USER_LOGIN_FAIL: 10006 // 用户名或密码错误(登录失败)
}

export const BUSINESS_MSG = {
  [BUSINESS_CODE.SUCCESS]: '操作成功',
  [BUSINESS_CODE.ERROR]: '操作失败',
  [BUSINESS_CODE.PARAM_ERROR]: '参数错误',
  [BUSINESS_CODE.USER_PARAM_MISSING]: '用户名或密码不能为空',
  [BUSINESS_CODE.USER_NAME_INVALID]: '用户名不合法(以字母开头，允许5-16字节，允许字母数字下划线)',
  [BUSINESS_CODE.PASSWORD_INVALID]:
    '密码不合法(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)',
  [BUSINESS_CODE.USER_NOT_FOUND]: '用户不存在',
  [BUSINESS_CODE.USER_EXIST]: '用户已存在',
  [BUSINESS_CODE.USER_LOGIN_FAIL]: '用户名或密码错误'
}
