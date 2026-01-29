import jwt from 'jsonwebtoken'
import { TokenSecret, TokenExpire } from '../config/setting.js'

export default function createToken(data) {
  return jwt.sign(data, TokenSecret, { expiresIn: TokenExpire })
}
