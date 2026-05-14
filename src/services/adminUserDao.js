import { query } from '../utils/db.js'

const buildUserFilters = ({ keyword, status, roleId }) => {
  const where = []
  const params = []

  if (keyword) {
    where.push('(u.username like ? or u.email like ?)')
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  if (status) {
    where.push('u.status = ?')
    params.push(status)
  }

  if (roleId) {
    where.push('u.roleId = ?')
    params.push(roleId)
  }

  return {
    whereSql: where.length > 0 ? `where ${where.join(' and ')}` : '',
    params
  }
}

const listUsers = async ({ keyword, status, roleId, page, pageSize }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, roleId })
  const offset = (page - 1) * pageSize
  const sql = `
    select
      u.id,
      u.username,
      u.gender,
      u.age,
      u.idCard,
      u.email,
      u.address,
      u.createTime,
      u.status,
      u.avatar,
      u.roleId,
      r.roleName
    from Users u
    left join Roles r on r.roleId = u.roleId
    ${whereSql}
    order by u.id desc
    limit ?, ?
  `

  return query(sql, [...params, offset, pageSize])
}

const countUsers = async ({ keyword, status, roleId }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, roleId })
  const sql = `
    select count(*) as total
    from Users u
    ${whereSql}
  `

  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

const findUserById = async (id) => {
  const sql = `
    select
      u.id,
      u.username,
      u.gender,
      u.age,
      u.idCard,
      u.email,
      u.address,
      u.createTime,
      u.status,
      u.avatar,
      u.roleId,
      u.password,
      r.roleName
    from Users u
    left join Roles r on r.roleId = u.roleId
    where u.id = ?
    limit 1
  `
  const rows = await query(sql, [id])
  return rows[0] || null
}

const findUserByUsername = async (username) => {
  const sql = 'select id, username from Users where username = ? limit 1'
  const rows = await query(sql, [username])
  return rows[0] || null
}

const findUserByEmail = async (email) => {
  const sql = 'select id, email from Users where email = ? limit 1'
  const rows = await query(sql, [email])
  return rows[0] || null
}

const findUserByIdCard = async (idCard) => {
  const sql = 'select id, idCard from Users where idCard = ? limit 1'
  const rows = await query(sql, [idCard])
  return rows[0] || null
}

const createUser = async ({ username, gender, age, idCard, email, address, status, avatar, roleId, passwordHash }) => {
  const sql = `
    insert into Users (username, gender, age, idCard, email, address, status, avatar, roleId, password)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  return query(sql, [username, gender, age, idCard, email, address, status, avatar, roleId, passwordHash])
}

const updateUser = async (id, payload) => {
  const fields = []
  const params = []

  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key} = ?`)
    params.push(value)
  }

  if (fields.length === 0) {
    return { affectedRows: 0 }
  }

  const sql = `update Users set ${fields.join(', ')} where id = ?`
  return query(sql, [...params, id])
}

const deleteUser = async (id) => {
  const sql = 'delete from Users where id = ?'
  return query(sql, [id])
}

const listRoleOptions = async () => {
  const sql = 'select roleId, roleName from Roles order by roleId asc'
  return query(sql)
}

export default {
  listUsers,
  countUsers,
  findUserById,
  findUserByUsername,
  findUserByEmail,
  findUserByIdCard,
  createUser,
  updateUser,
  deleteUser,
  listRoleOptions
}
