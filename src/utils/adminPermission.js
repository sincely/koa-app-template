/**
 * 解析菜单 meta 字段：
 * - 已是对象则原样返回
 * - 字符串则尝试 JSON.parse
 * - 其他情况返回空对象
 * @param {unknown} meta
 * @returns {Record<string, any>}
 */
const parseMeta = (meta) => {
  if (!meta) {
    return {}
  }

  if (typeof meta === 'object') {
    return meta
  }

  try {
    return JSON.parse(meta)
  } catch {
    return {}
  }
}

/**
 * 规范化数据库菜单结构，转换为前端路由树节点格式。
 * @param {{id:number,parent_id:number|null,path:string,name:string,component?:string,redirect?:string,meta?:unknown}} menu
 * @returns {{id:number,parentId:number|null,path:string,name:string,component?:string,redirect?:string,meta:Record<string, any>,children:any[]}}
 */
const normalizeMenu = (menu) => {
  return {
    id: menu.id,
    parentId: menu.parent_id,
    path: menu.path,
    name: menu.name,
    component: menu.component,
    redirect: menu.redirect,
    meta: parseMeta(menu.meta),
    children: []
  }
}

/**
 * 根据扁平菜单列表构建树形菜单。
 * @param {Array<{id:number,parent_id:number|null,path:string,name:string,component?:string,redirect?:string,meta?:unknown}>} menuList
 * @returns {Array<any>}
 */
export const buildMenuTree = (menuList) => {
  const menuMap = new Map()
  const roots = []

  for (const menu of menuList) {
    menuMap.set(menu.id, normalizeMenu(menu))
  }

  for (const menu of menuMap.values()) {
    if (menu.parentId && menuMap.has(menu.parentId)) {
      menuMap.get(menu.parentId).children.push(menu)
      continue
    }
    roots.push(menu)
  }

  return roots
}

/**
 * 提取权限编码集合：
 * - routePaths: 允许访问的路径
 * - routeNames: 允许访问的路由名称
 * - buttons: 允许使用的按钮权限编码
 * @param {Array<{path:string,name:string}>} menus
 * @param {Array<{buttonName?:string}>} buttons
 * @returns {{routePaths:string[], routeNames:string[], buttons:string[]}}
 */
export const extractPermissionCodes = (menus, buttons) => {
  return {
    routePaths: menus.map((menu) => menu.path),
    routeNames: menus.map((menu) => menu.name),
    buttons: buttons.map((button) => button.buttonName).filter(Boolean)
  }
}
