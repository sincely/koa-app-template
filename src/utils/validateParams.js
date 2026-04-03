import { businessCode } from '../config/businessCode.js'

/**
 * 参数校验工具函数
 * @param {Object} schema - Joi schema对象
 * @param {Object} data - 待校验的数据
 * @returns {Object|null} - 校验通过返回null，失败返回包含code和msg的对象
 */
export const validateParams = (schema, data) => {
  const { error } = schema.validate(data)
  if (error) {
    // 默认错误码为 PARAM_ERROR (参数错误)，也可以根据 error.details[0].type 细分
    // 这里为了简单，统一返回错误信息
    return {
      code: businessCode.paramError,
      msg: error.details[0].message
    }
  }
  return null
}
