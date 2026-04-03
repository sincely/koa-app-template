/**
 * 业务错误码
 * 区分于 HTTP Status Code
 * 0: 成功
 * 100xx: 用户模块错误
 * 200xx: 系统模块错误
 */
export const businessCode = {
  // 全局
  success: 0,
  error: 1,
  paramError: 2, // 参数错误

  // 用户模块
  userParamMissing: 10001, // 用户名或密码为空
  userNameInvalid: 10002, // 用户名格式错误
  passwordInvalid: 10003, // 密码格式错误
  userNotFound: 10004, // 用户不存在
  userExist: 10005, // 用户已存在
  userLoginFail: 10006 // 用户名或密码错误(登录失败)
}

export const businessMsg = {
  [businessCode.success]: '操作成功',
  [businessCode.error]: '操作失败',
  [businessCode.paramError]: '参数错误',
  [businessCode.userParamMissing]: '用户名或密码不能为空',
  [businessCode.userNameInvalid]: '用户名不合法(以字母开头，允许5-16字节，允许字母数字下划线)',
  [businessCode.passwordInvalid]: '密码不合法(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)',
  [businessCode.userNotFound]: '用户不存在',
  [businessCode.userExist]: '用户已存在',
  [businessCode.userLoginFail]: '用户名或密码错误'
}
