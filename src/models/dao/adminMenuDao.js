import { getConnection, query } from '../../utils/db.js'

const listMenus = async () => {
  const sql = `
    select
      id,
      path,
      name,
      component,
      redirect,
      meta,
      parent_id
    from RouteAuth
    order by coalesce(parent_id, 0), id asc
  `

  return query(sql)
}

const findMenuById = async (id) => {
  const sql = `
    select id, path, name, component, redirect, meta, parent_id
    from RouteAuth
    where id = ?
    limit 1
  `
  const rows = await query(sql, [id])
  return rows[0] || null
}

const findMenuByPath = async (path) => {
  const sql = 'select id, path from RouteAuth where path = ? limit 1'
  const rows = await query(sql, [path])
  return rows[0] || null
}

const findMenuByName = async (name) => {
  const sql = 'select id, name from RouteAuth where name = ? limit 1'
  const rows = await query(sql, [name])
  return rows[0] || null
}

const createMenu = async ({ path, name, component, redirect, meta, parentId }) => {
  const sql = `
    insert into RouteAuth (path, name, component, redirect, meta, parent_id)
    values (?, ?, ?, ?, ?, ?)
  `

  return query(sql, [path, name, component, redirect, meta, parentId])
}

const updateMenu = async (id, payload) => {
  const fields = []
  const params = []

  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key} = ?`)
    params.push(value)
  }

  if (fields.length === 0) {
    return { affectedRows: 0 }
  }

  const sql = `update RouteAuth set ${fields.join(', ')} where id = ?`
  return query(sql, [...params, id])
}

const countChildren = async (id) => {
  const sql = 'select count(*) as total from RouteAuth where parent_id = ?'
  const rows = await query(sql, [id])
  return rows[0]?.total || 0
}

const deleteMenu = async (id) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from ButtonAuth where routeId = ?', [id])
    await connection.execute('delete from RoleRoute where routeId = ?', [id])
    const [result] = await connection.execute('delete from RouteAuth where id = ?', [id])
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export default {
  listMenus,
  findMenuById,
  findMenuByPath,
  findMenuByName,
  createMenu,
  updateMenu,
  countChildren,
  deleteMenu
}
