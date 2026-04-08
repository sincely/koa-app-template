import { query } from '../../utils/db.js'

const findMenusByRoleId = async (roleId) => {
  const sql = `
    select distinct
      ra.id,
      ra.path,
      ra.name,
      ra.component,
      ra.redirect,
      ra.meta,
      ra.parent_id
    from RoleRoute rr
    inner join RouteAuth ra on ra.id = rr.routeId
    where rr.roleId = ?
    order by coalesce(ra.parent_id, 0), ra.id
  `

  return query(sql, [roleId])
}

const findButtonsByRoleId = async (roleId) => {
  const sql = `
    select distinct
      ba.buttonId,
      ba.routeId,
      ba.routeName,
      ba.buttonName
    from RoleRoute rr
    inner join ButtonAuth ba on ba.routeId = rr.routeId
    where rr.roleId = ?
    order by ba.routeId asc, ba.buttonId asc
  `

  return query(sql, [roleId])
}

export default {
  findMenusByRoleId,
  findButtonsByRoleId
}
