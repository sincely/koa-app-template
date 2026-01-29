const HTTP_CODE = {
  OK: 200, // 成功
  CREATED: 201, // 创建成功
  ACCEPTED: 202, // 已接受
  NO_CONTENT: 204, // 无内容
  BAD_REQUEST: 400, // 请求参数错误
  UNAUTHORIZED: 401, // 未授权
  FORBIDDEN: 403, // 禁止访问
  NOT_FOUND: 404, // 资源不存在
  METHOD_NOT_ALLOWED: 405, // 方法不允许
  REQUEST_TIMEOUT: 408, // 请求超时
  CONFLICT: 409, // 资源冲突
  UNPROCESSABLE_ENTITY: 422, // 无法处理的实体
  INTERNAL_SERVER_ERROR: 500, // 服务器内部错误
  NOT_IMPLEMENTED: 501, // 未实现
  BAD_GATEWAY: 502, // 网关错误
  SERVICE_UNAVAILABLE: 503, // 服务不可用
  GATEWAY_TIMEOUT: 504 // 网关超时
}

const HTTP_MESSAGE = {
  [HTTP_CODE.OK]: 'Success',
  [HTTP_CODE.CREATED]: 'Created',
  [HTTP_CODE.ACCEPTED]: 'Accepted',
  [HTTP_CODE.NO_CONTENT]: 'No Content',
  [HTTP_CODE.BAD_REQUEST]: 'Bad Request',
  [HTTP_CODE.UNAUTHORIZED]: 'Unauthorized',
  [HTTP_CODE.FORBIDDEN]: 'Forbidden',
  [HTTP_CODE.NOT_FOUND]: 'Not Found',
  [HTTP_CODE.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HTTP_CODE.REQUEST_TIMEOUT]: 'Request Timeout',
  [HTTP_CODE.CONFLICT]: 'Conflict',
  [HTTP_CODE.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HTTP_CODE.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HTTP_CODE.NOT_IMPLEMENTED]: 'Not Implemented',
  [HTTP_CODE.BAD_GATEWAY]: 'Bad Gateway',
  [HTTP_CODE.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HTTP_CODE.GATEWAY_TIMEOUT]: 'Gateway Timeout'
}

export { HTTP_CODE, HTTP_MESSAGE }
