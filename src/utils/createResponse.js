/**
 * 创建错误响应对象
 * @param {number} status - 状态码
 * @param {string} message - 错误信息
 * @param {any} errors - 错误详情
 * @example
 * 返回 { success: false, status: 500, message: 'Server Error', errors: ... }
 * createErrorResponse(500, 'Server Error', { code: 'DB_ERROR' });
 */
export function createErrorResponse(message, status, errors) {
  return { success: false, message, status, errors }
}

/**
 * 创建失败响应对象
 * @param {number} status - 状态码
 * @param {string} message - 失败信息
 * @example
 * 返回 { success: false, status: 404, message: 'Not Found' }
 * createFailResponse(404, 'Resource not found');
 */
export function createFailResponse(message, status) {
  return { success: false, message, status }
}

/**
 * 创建成功响应对象
 * @param {number} status - 状态码
 * @param {string} message - 成功信息
 * @param {any} data - 响应数据
 * @example
 * 返回 { success: true, status: 200, message: 'Success', data: { id: 1 } }
 * createSuccessResponse(200, 'Operation successful', { id: 1, name: 'Test' });
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
