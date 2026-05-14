import { getConnection, query } from '../utils/db.js'

/**
 * 查询角色列表，并统计每个角色的用户数。
 * @returns {Promise<Array<any>>}
 */
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

/**
 * 根据角色 ID 查询角色详情。
 * @param {number} roleId
 * @returns {Promise<any | null>}
 */
const findRoleById = async (roleId) => {
  const sql = 'select roleId, roleName, description from Roles where roleId = ? limit 1'
  const rows = await query(sql, [roleId])
  return rows[0] || null
}

/**
 * 根据角色名查询角色（用于唯一性校验）。
 * @param {string} roleName
 * @returns {Promise<any | null>}
 */
const findRoleByName = async (roleName) => {
  const sql = 'select roleId, roleName from Roles where roleName = ? limit 1'
  const rows = await query(sql, [roleName])
  return rows[0] || null
}

/**
 * 查询角色绑定的路由 ID 集合。
 * @param {number} roleId
 * @returns {Promise<number[]>}
 */
const getRouteIdsByRoleId = async (roleId) => {
  const sql = 'select routeId from RoleRoute where roleId = ? order by routeId asc'
  const rows = await query(sql, [roleId])
  return rows.map((item) => item.routeId)
}

/**
 * 创建角色并绑定路由（事务）。
 * @param {{roleName:string,description:string,routeIds:number[]}} payload
 * @returns {Promise<{roleId:number, affectedRows:number}>}
 */
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

/**
 * 更新角色信息并重建角色路由关系（事务）。
 * @param {{roleId:number,roleName:string,description:string,routeIds:number[]}} payload
 * @returns {Promise<{affectedRows:number}>}
 */
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

/**
 * 删除角色并清理角色路由关系（事务）。
 * @param {number} roleId
 * @returns {Promise<any>}
 */
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

/**
 * 统计角色下绑定的用户数量。
 * @param {number} roleId
 * @returns {Promise<number>}
 */
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
