import logger from '../config/logger.js'

/**
 * 创建错误响应对象，并联动日志记录完整错误堆栈
 * @param {string} message - 错误信息
 * @param {number} status - 状态码
 * @param {any} errors - 错误详情
 * @param {Error} [cause] - 原始错误对象（可选，传入时自动记录完整堆栈）
 * @example
 * 返回 { success: false, message: 'Server Error', status: 500, errors: ... }
 * createErrorResponse('Server Error', 500, { code: 'DB_ERROR' });
 * createErrorResponse('Server Error', 500, {}, new Error('DB connection failed'));
 */
export function createErrorResponse(message, status, errors, cause) {
  // 联动日志：记录完整的错误堆栈，方便定位代码崩溃位置
  const errSource = cause instanceof Error ? cause : errors instanceof Error ? errors : null
  if (errSource) {
    logger.error(
      {
        err: errSource,
        status,
        ...(errors instanceof Error ? {} : { errors })
      },
      message
    )
  }

  return {
    success: false,
    message,
    status,
    errors: errors instanceof Error ? { name: errors.name, message: errors.message } : errors
  }
}

/**
 * 创建失败响应对象（业务预期内的失败，不记录堆栈）
 * @param {string} message - 失败信息
 * @param {number} status - 状态码
 * @example
 * 返回 { success: false, message: 'Not Found', status: 404 }
 * createFailResponse('Resource not found', 404);
 */
export function createFailResponse(message, status) {
  return { success: false, message, status }
}

/**
 * 创建成功响应对象
 * @param {string} message - 成功信息
 * @param {number} status - 状态码
 * @param {any} data - 响应数据
 * @example
 * 返回 { success: true, message: 'Success', status: 200, data: { id: 1 } }
 * createSuccessResponse('Operation successful', 200, { id: 1, name: 'Test' });
 */
export function createSuccessResponse(message, status, data) {
  return { success: true, message, status, data }
}

/**
 * 分页响应
 * @param {Array} list - 数据列表
 * @param {number} total - 总数
 * @param {number} page - 当前页
 * @param {number} pageSize - 每页数量
 * @returns {Object} 响应对象
 */
export function createPaginatedResponse(list, total, page, pageSize) {
  return {
    success: true,
    status: 200,
    message: 'Success',
    data: {
      list,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }
}
