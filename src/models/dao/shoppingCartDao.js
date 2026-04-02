/*
 * @Description: 购物车模块数据持久层
 * @Author: hai-27
 * @Date: 2020-02-19 16:17:19
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 15:58:55
 */

import { query } from '../../utils/db.js'

// 获取购物车信息
const GetShoppingCart = async (user_id) => {
  const sql = 'select * from shoppingCart where user_id = ?'
  return await query(sql, [user_id])
}

// 查询用户的购物车的某个商品
const FindShoppingCart = async (user_id, product_id) => {
  const sql = 'select * from shoppingCart where user_id = ? and product_id = ?'
  return await query(sql, [user_id, product_id])
}

// 新插入购物车信息
const AddShoppingCart = async (user_id, product_id) => {
  const sql = 'insert into shoppingCart values(null,?,?,1)'
  return await query(sql, [user_id, product_id])
}

// 更新购物车商品数量
const UpdateShoppingCart = async (NewNum, user_id, product_id) => {
  const sql = 'update shoppingCart set num =? where user_id =? and product_id =?'
  return await query(sql, [NewNum, user_id, product_id])
}

// 删除购物车信息
const DeleteShoppingCart = async (user_id, product_id) => {
  const sql = 'delete from shoppingCart where user_id =? and product_id =?'
  return await query(sql, [user_id, product_id])
}

export default {
  GetShoppingCart,
  FindShoppingCart,
  AddShoppingCart,
  UpdateShoppingCart,
  DeleteShoppingCart
}
