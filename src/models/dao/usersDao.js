import db from '../../utils/db.js'

// 连接数据库根据用户名和密码查询用户信息
const login = (userName, password) => {
  const sql = 'select * from users where userName = ? and password = ?'
  return db.query(sql, [userName, password])
}

// 连接数据库根据用户名查询用户信息
const findUserName = (userName) => {
  const sql = 'select * from users where userName = ?'
  return db.query(sql, [userName])
}

// 连接数据库插入用户信息
const register = (userName, password) => {
  const sql = 'insert into users values(null,?,?,null)'
  return db.query(sql, [userName, password])
}

export default {
  login,
  findUserName,
  register
}
