import './env.js'

export const TokenSecret = process.env.JWT_SECRET
export const TokenExpire = process.env.JWT_EXPIRES_IN || '7d'
