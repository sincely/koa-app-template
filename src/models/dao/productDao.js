import { query } from '../../utils/db.js'

// 连接数据库获取商品分类
const GetCategory = async () => {
  const sql = 'select * from category'
  return await query(sql, [])
}

// 连接数据库根据商品分类名称获取分类id
const GetCategoryId = async (categoryName) => {
  const sql = 'select * from category where category_name = ?'
  const category = await query(sql, [categoryName])
  return category?.[0]?.category_id
}

// 连接数据库,根据商品分类id获取首页展示的商品信息
const GetPromoProduct = async (categoryID) => {
  const sql = 'select * from product where category_id = ? order by product_sales desc limit 7'
  return await query(sql, [categoryID])
}

// 连接数据库,分页获取所有的商品信息
const GetAllProduct = async (offset = 0, rows = 0) => {
  let sql = 'select * from product '
  const params = []
  if (rows !== 0) {
    sql += 'limit ?, ?'
    params.push(offset, rows)
  }
  return await query(sql, params)
}

// 连接数据库,根据商品分类id,分页获取商品信息
const GetProductByCategory = async (categoryID, offset = 0, rows = 0) => {
  const categoryIds = Array.isArray(categoryID) ? categoryID : [categoryID]
  const placeholders = categoryIds.map(() => '?').join(',')
  let sql = `select * from product where category_id in (${placeholders}) `
  const params = [...categoryIds]

  if (rows !== 0) {
    sql += 'order by product_sales desc limit ?, ?'
    params.push(offset, rows)
  }

  return await query(sql, params)
}

// 连接数据库,根据搜索条件,分页获取商品信息
const GetProductBySearch = async (search, offset = 0, rows = 0) => {
  let sql = 'select * from product where product_name like ? or product_title like ? or product_intro like ? '
  const keyword = `%${search}%`
  const params = [keyword, keyword, keyword]

  if (rows !== 0) {
    sql += 'order by product_sales desc limit ?, ?'
    params.push(offset, rows)
  }

  return await query(sql, params)
}

// 连接数据库,根据商品id,获取商品详细信息
const GetProductById = async (id) => {
  const sql = 'select * from product where product_id = ?'
  return await query(sql, [id])
}

// 连接数据库,根据商品id,获取商品图片
const GetDetailsPicture = async (productID) => {
  const sql = 'select * from product_picture where product_id = ? '
  return await query(sql, [productID])
}

export default {
  GetCategory,
  GetCategoryId,
  GetPromoProduct,
  GetAllProduct,
  GetProductByCategory,
  GetProductBySearch,
  GetProductById,
  GetDetailsPicture
}
