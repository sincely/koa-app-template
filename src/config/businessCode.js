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
  userLoginFail: 10006, // 用户名或密码错误(登录失败)
  adminUserDisabled: 10010, // 后台账号已禁用
  roleNotFound: 10011, // 角色不存在
  permissionDenied: 10012, // 权限不足
  emailExist: 10013, // 邮箱已存在
  roleExist: 10014, // 角色已存在
  roleInUse: 10015, // 角色仍被使用
  menuPathExist: 10016, // 菜单路径已存在
  menuNameExist: 10017, // 菜单名称已存在
  menuHasChildren: 10018, // 菜单存在子节点
  userDeleteSelfDenied: 10019, // 不能删除自己
  idCardExist: 10020 // 身份证号已存在
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
  [businessCode.userLoginFail]: '用户名或密码错误',
  [businessCode.adminUserDisabled]: '账号已被禁用',
  [businessCode.roleNotFound]: '角色不存在',
  [businessCode.permissionDenied]: '暂无访问权限',
  [businessCode.emailExist]: '邮箱已存在',
  [businessCode.roleExist]: '角色已存在',
  [businessCode.roleInUse]: '当前角色仍有关联用户，无法删除',
  [businessCode.menuPathExist]: '菜单路径已存在',
  [businessCode.menuNameExist]: '菜单名称已存在',
  [businessCode.menuHasChildren]: '当前菜单存在子菜单，无法删除',
  [businessCode.userDeleteSelfDenied]: '不能删除当前登录账号',
  [businessCode.idCardExist]: '身份证号已存在'
}
