/**
 * JSDoc 注释扫描器
 * 扫描 Controller 文件中的 JSDoc 注释，自动生成 OpenAPI 规范
 *
 * 支持的标签：
 *   @api GET|POST|PUT|DELETE /path        — 接口路由（必须）
 *   @description 标签名 - 标签描述（可选）    — API 分组（必须）
 *   @auth public|secured                    — 是否需要鉴权（默认 secured）
 *   @body {type} name - 描述                — 请求体字段（必填）
 *   @body {type} [name] - 描述              — 请求体字段（选填）
 *   @query {type} name - 描述               — 查询参数（必填）
 *   @query {type} [name] - 描述             — 查询参数（选填）
 */
import fs from 'fs'
import path from 'path'

/** JSDoc 类型 → OpenAPI 类型 */
const TYPE_MAP = {
  string: { type: 'string' },
  number: { type: 'number' },
  integer: { type: 'integer' },
  boolean: { type: 'boolean' },
  array: { type: 'array' },
  object: { type: 'object' }
}

/** 解析 {type} 为 OpenAPI schema */
const parseType = (typeStr) => ({ ...(TYPE_MAP[typeStr] || TYPE_MAP.string) })

/**
 * 解析 @body / @query 标签
 * 格式: @body {string} name - 描述  或  @body {string} [name] - 描述
 */
const parseField = (line) => {
  const match = line.match(/@(?:body|query)\s+\{(\w+)\}\s+(\[?)(\w+)(\]?)\s*(?:-\s*(.+))?/)
  if (!match) {
    return null
  }
  const [, typeStr, open, name, close, desc] = match
  return {
    name,
    schema: parseType(typeStr),
    required: !(open === '[' && close === ']'),
    description: desc?.trim() || ''
  }
}

/**
 * 解析单个 JSDoc 注释块
 */
const parseBlock = (lines) => {
  // 查找 @api
  const routeLine = lines.find((l) => l.startsWith('@api'))
  if (!routeLine) {
    return null
  }

  const routeMatch = routeLine.match(/@api\s+(GET|POST|PUT|DELETE|PATCH)\s+(\/+\S+)/i)
  if (!routeMatch) {
    return null
  }

  const method = routeMatch[1].toLowerCase()
  const routePath = routeMatch[2]

  // 非标签行 → summary / description
  const textLines = lines.filter((l) => !l.startsWith('@')).filter(Boolean)
  const summary = textLines[0] || ''
  const summaryParts = summary.split(' - ')
  const description = summaryParts.length > 1 ? summaryParts.slice(1).join(' - ') : summaryParts[0]

  // @description
  const descLine = lines.find((l) => l.startsWith('@description'))
  const descRaw = descLine ? descLine.replace('@description', '').trim() : 'default'
  const descParts = descRaw.split(' - ')
  const tagName = descParts[0].trim()
  const tagDesc = descParts[1]?.trim() || ''

  // @auth
  const authLine = lines.find((l) => l.startsWith('@auth'))
  const isPublic = authLine ? authLine.toLowerCase().includes('public') : false

  // @body
  const bodyFields = lines
    .filter((l) => l.startsWith('@body'))
    .map(parseField)
    .filter(Boolean)

  // @query
  const queryParams = lines
    .filter((l) => l.startsWith('@query'))
    .map(parseField)
    .filter(Boolean)

  // 构建 OpenAPI operation
  const operation = {
    tags: [tagName],
    summary: summaryParts[0],
    ...(description && description !== summaryParts[0] ? { description } : {}),
    security: isPublic ? [] : [{ bearerAuth: [] }]
  }

  if (bodyFields.length > 0) {
    const required = bodyFields.filter((f) => f.required).map((f) => f.name)
    const properties = {}
    bodyFields.forEach((f) => {
      properties[f.name] = f.description ? { ...f.schema, description: f.description } : { ...f.schema }
    })
    operation.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            ...(required.length > 0 ? { required } : {}),
            properties
          }
        }
      }
    }
  }

  if (queryParams.length > 0) {
    operation.parameters = queryParams.map((p) => ({
      name: p.name,
      in: 'query',
      required: p.required,
      schema: p.schema,
      ...(p.description ? { description: p.description } : {})
    }))
  }

  // 默认响应结构 { code, msg, data? }
  operation.responses = {
    200: {
      description: '成功响应',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: { type: 'integer' },
              msg: { type: 'string' }
            }
          }
        }
      }
    }
  }

  return { method, path: routePath, operation, tagDef: { name: tagName, ...(tagDesc ? { description: tagDesc } : {}) } }
}

/**
 * 从文件内容中提取所有 JSDoc 块并解析
 */
const parseFile = (content) => {
  const results = []
  const jsdocRegex = /\/\*\*\s*\n([\s\S]*?)\*\//g
  let match

  while ((match = jsdocRegex.exec(content)) !== null) {
    const block = match[1]
    const lines = block
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .filter((l) => l.length > 0)

    const parsed = parseBlock(lines)
    if (parsed) {
      results.push(parsed)
    }
  }

  return results
}

/**
 * 扫描 Controller 目录，生成 OpenAPI 的 tags 和 paths
 * @param {string} dir - 控制层目录绝对路径
 * @returns {{ tags: Array, paths: Object }}
 */
export const scanControllers = (dir) => {
  const tags = []
  const paths = {}
  const tagMap = new Map()

  const walk = (dirPath) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const full = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        const content = fs.readFileSync(full, 'utf-8')
        for (const item of parseFile(content)) {
          // 去重 tag
          if (!tagMap.has(item.tagDef.name)) {
            tagMap.set(item.tagDef.name, item.tagDef)
          } else if (item.tagDef.description) {
            // 补充描述（如果首次没有描述）
            const existing = tagMap.get(item.tagDef.name)
            if (!existing.description) {
              existing.description = item.tagDef.description
            }
          }
          // 合并 path
          if (!paths[item.path]) {
            paths[item.path] = {}
          }
          paths[item.path][item.method] = item.operation
        }
      }
    }
  }

  walk(dir)
  return { tags: [...tagMap.values()], paths }
}
