/*
 * @Description: 订单模块数据持久层
 * @Author: hai-27
 * @Date: 2020-02-24 16:36:19
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 14:31:56
 */
import { query } from '../../utils/db.js'

// 连接数据库获取所有的订单id
const GetOrderGroup = async (user_id) => {
  const sql = 'select order_id from orders where user_id = ? group by order_id order by order_id desc'
  return await query(sql, [user_id])
}

// 连接数据库获取所有的订单详细信息
const GetOrder = async (user_id) => {
  const sql = 'select * from orders where user_id = ? order by order_time desc'
  return await query(sql, [user_id])
}

// 连接数据库插入订单信息
const AddOrder = async (length, data) => {
  let sql = 'insert into orders values(null,?,?,?,?,?,?)'
  for (let i = 0; i < length - 1; i++) {
    sql += ',(null,?,?,?,?,?,?)'
  }

  return await query(sql, data)
}

export default {
  GetOrderGroup,
  GetOrder,
  AddOrder
}
