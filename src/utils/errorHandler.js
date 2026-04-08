import { createErrorResponse, createFailResponse } from './createResponse.js'

/** @typedef {import('koa').Context} Context */
/** @typedef {import('koa').Next} Next */

const isHttpError = (err) => {
  if (!err || typeof err !== 'object') {
    return false
  }
  const status = /** @type {any} */ (err).status ?? /** @type {any} */ (err).statusCode
  return typeof status === 'number' && Number.isFinite(status)
}

/**
 * @param {(ctx: Context, next: Next) => (Promise<void> | void)} controller
 * @returns {(ctx: Context, next: Next) => Promise<void>}
 */
export const errorControllerWrapper = (controller) => {
  return async (ctx, next) => {
    try {
      await controller(ctx, next)
    } catch (err) {
      if (isHttpError(err)) {
        const status = err.status ?? err.statusCode
        ctx.status = status
        ctx.body = createFailResponse(err.message || 'Request failed', ctx.status)
        return
      }

      ctx.status = 500
      ctx.body = createErrorResponse('Something went wrong', ctx.status, {})
    }
  }
}
