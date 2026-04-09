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

export const extractPermissionCodes = (menus, buttons) => {
  return {
    routePaths: menus.map((menu) => menu.path),
    routeNames: menus.map((menu) => menu.name),
    buttons: buttons.map((button) => button.buttonName).filter(Boolean)
  }
}
