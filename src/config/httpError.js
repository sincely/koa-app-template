const httpCode = {
  ok: 200, // 成功
  created: 201, // 创建成功
  accepted: 202, // 已接受
  noContent: 204, // 无内容
  badRequest: 400, // 请求参数错误
  unauthorized: 401, // 未授权
  forbidden: 403, // 禁止访问
  notFound: 404, // 资源不存在
  methodNotAllowed: 405, // 方法不允许
  requestTimeout: 408, // 请求超时
  conflict: 409, // 资源冲突
  unprocessableEntity: 422, // 无法处理的实体
  internalServerError: 500, // 服务器内部错误
  notImplemented: 501, // 未实现
  badGateway: 502, // 网关错误
  serviceUnavailable: 503, // 服务不可用
  gatewayTimeout: 504 // 网关超时
}

const httpMessage = {
  [httpCode.ok]: 'Success',
  [httpCode.created]: 'Created',
  [httpCode.accepted]: 'Accepted',
  [httpCode.noContent]: 'No Content',
  [httpCode.badRequest]: 'Bad Request',
  [httpCode.unauthorized]: 'Unauthorized',
  [httpCode.forbidden]: 'Forbidden',
  [httpCode.notFound]: 'Not Found',
  [httpCode.methodNotAllowed]: 'Method Not Allowed',
  [httpCode.requestTimeout]: 'Request Timeout',
  [httpCode.conflict]: 'Conflict',
  [httpCode.unprocessableEntity]: 'Unprocessable Entity',
  [httpCode.internalServerError]: 'Internal Server Error',
  [httpCode.notImplemented]: 'Not Implemented',
  [httpCode.badGateway]: 'Bad Gateway',
  [httpCode.serviceUnavailable]: 'Service Unavailable',
  [httpCode.gatewayTimeout]: 'Gateway Timeout'
}

export { httpCode, httpMessage }
