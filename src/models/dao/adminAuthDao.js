import { query } from '../../utils/db.js'

const getAdminUserBaseSql = `
  select
    u.id,
    u.username,
    u.email,
    u.status,
    u.avatar,
    u.roleId,
    u.password,
    r.roleName,
    r.description as roleDescription
  from Users u
  left join Roles r on r.roleId = u.roleId
`

const findAdminUserByUsername = async (username) => {
  const sql = `${getAdminUserBaseSql} where u.username = ? limit 1`
  const rows = await query(sql, [username])
  return rows[0] || null
}

const findAdminUserByEmail = async (email) => {
  const sql = `${getAdminUserBaseSql} where u.email = ? limit 1`
  const rows = await query(sql, [email])
  return rows[0] || null
}

const findAdminUserById = async (userId) => {
  const sql = `${getAdminUserBaseSql} where u.id = ? limit 1`
  const rows = await query(sql, [userId])
  return rows[0] || null
}

const findRoleByName = async (roleName) => {
  const sql = 'select roleId, roleName, description from Roles where roleName = ? limit 1'
  const rows = await query(sql, [roleName])
  return rows[0] || null
}

const createRegisterIdCard = () => {
  return `A${Date.now()}${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}`
}

const createAdminUser = async ({ username, email, passwordHash, roleId }) => {
  const sql = `
    insert into Users (username, gender, age, idCard, email, address, status, avatar, roleId, password)
    values (?, 'other', null, ?, ?, null, 'active', null, ?, ?)
  `

  return query(sql, [username, createRegisterIdCard(), email, roleId, passwordHash])
}

export default {
  findAdminUserByUsername,
  findAdminUserByEmail,
  findAdminUserById,
  findRoleByName,
  createAdminUser
}
