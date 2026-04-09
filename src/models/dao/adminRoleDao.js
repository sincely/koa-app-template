import { getConnection, query } from '../../utils/db.js'

const listRoles = async () => {
  const sql = `
    select
      r.roleId,
      r.roleName,
      r.description,
      count(u.id) as userCount
    from Roles r
    left join Users u on u.roleId = r.roleId
    group by r.roleId, r.roleName, r.description
    order by r.roleId asc
  `

  return query(sql)
}

const findRoleById = async (roleId) => {
  const sql = 'select roleId, roleName, description from Roles where roleId = ? limit 1'
  const rows = await query(sql, [roleId])
  return rows[0] || null
}

const findRoleByName = async (roleName) => {
  const sql = 'select roleId, roleName from Roles where roleName = ? limit 1'
  const rows = await query(sql, [roleName])
  return rows[0] || null
}

const getRouteIdsByRoleId = async (roleId) => {
  const sql = 'select routeId from RoleRoute where roleId = ? order by routeId asc'
  const rows = await query(sql, [roleId])
  return rows.map((item) => item.routeId)
}

const createRoleWithRoutes = async ({ roleName, description, routeIds }) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    const [roleResult] = await connection.execute('insert into Roles (roleName, description) values (?, ?)', [
      roleName,
      description
    ])
    const roleId = roleResult.insertId

    if (routeIds.length > 0) {
      const valuesSql = routeIds.map(() => '(?, ?)').join(', ')
      const values = routeIds.flatMap((routeId) => [roleId, routeId])
      await connection.execute(`insert into RoleRoute (roleId, routeId) values ${valuesSql}`, values)
    }

    await connection.commit()
    return { roleId, affectedRows: roleResult.affectedRows }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

const updateRoleWithRoutes = async ({ roleId, roleName, description, routeIds }) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('update Roles set roleName = ?, description = ? where roleId = ?', [
      roleName,
      description,
      roleId
    ])
    await connection.execute('delete from RoleRoute where roleId = ?', [roleId])

    if (routeIds.length > 0) {
      const valuesSql = routeIds.map(() => '(?, ?)').join(', ')
      const values = routeIds.flatMap((routeId) => [roleId, routeId])
      await connection.execute(`insert into RoleRoute (roleId, routeId) values ${valuesSql}`, values)
    }

    await connection.commit()
    return { affectedRows: 1 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

const deleteRole = async (roleId) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from RoleRoute where roleId = ?', [roleId])
    const [result] = await connection.execute('delete from Roles where roleId = ?', [roleId])
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

const countUsersByRoleId = async (roleId) => {
  const sql = 'select count(*) as total from Users where roleId = ?'
  const rows = await query(sql, [roleId])
  return rows[0]?.total || 0
}

export default {
  listRoles,
  findRoleById,
  findRoleByName,
  getRouteIdsByRoleId,
  createRoleWithRoutes,
  updateRoleWithRoutes,
  deleteRole,
  countUsersByRoleId
}
