import { query } from '../../utils/db.js'

// 连接数据库,把收藏商品信息插入数据库
const AddCollect = async (user_id, product_id, timeTemp) => {
  const sql = 'insert into collect values(null,?,?,?)'
  return await query(sql, [user_id, product_id, timeTemp])
}

// 连接数据库,获取用户的所有收藏商品信息
const GetCollect = async (user_id) => {
  const sql = 'select * from collect where user_id=?'
  return await query(sql, [user_id])
}

// 连接数据库,获取用户的某个收藏商品信息
const FindCollect = async (user_id, product_id) => {
  const sql = 'select * from collect where user_id=? and product_id=?'
  return await query(sql, [user_id, product_id])
}

// 连接数据库,删除用户的某个收藏商品信息
const DeleteCollect = async (user_id, product_id) => {
  const sql = 'delete from collect where user_id=? and product_id=?'
  return await query(sql, [user_id, product_id])
}

export default {
  AddCollect,
  GetCollect,
  FindCollect,
  DeleteCollect
}
