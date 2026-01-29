/**
 * @param {number} status
 * @param {string} message
 * @param {any} errors
 * @example
 * Returns { success: false, status: 500, message: 'Server Error', errors: ... }
 * createErrorResponse(500, 'Server Error', { code: 'DB_ERROR' });
 */
export function createErrorResponse(status, message, errors) {
  return { success: false, status, message, errors }
}

/**
 * @param {number} status
 * @param {string} message
 * @example
 * Returns { success: false, status: 404, message: 'Not Found' }
 * createFailResponse(404, 'Resource not found');
 */
export function createFailResponse(status, message) {
  return { success: false, status, message }
}

/**
 * @param {number} status
 * @param {string} message
 * @param {any} data
 * @example
 * Returns { success: true, status: 200, message: 'Success', data: { id: 1 } }
 * createSuccessResponse(200, 'Operation successful', { id: 1, name: 'Test' });
 */
export function createSuccessResponse(status, message, data) {
  return { success: true, status, message, data }
}
