/**
 * @fileoverview 从 JSDoc 注释生成 OpenAPI 3.0 格式文档（Apifox 可直接导入）
 * @description 解析 controllers 中的 JSDoc 注释，生成 OpenAPI 3.0 格式的 API 文档
 *
 * 目录结构：
 * controllers/
 *   users/                 # 用户模块
 *     userController.js    # @module 用户模块
 *   orders/                # 订单模块
 *     orderController.js   # @module 订单模块
 *
 * JSDoc 格式说明：
 * @module 模块名称（文件级别，用于分组）
 * @summary 接口简要说明
 * @description 接口详细描述
 * @api METHOD /path
 * @param {type} name - 参数描述
 * @returns {type} code - 返回值描述
 *
 * 使用方式：node scripts/generateApifoxDoc.js
 * 输出文件：docs/apifox.json (OpenAPI 3.0 格式)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
  controllersDir: path.resolve(__dirname, '../src/controllers'),
  outputFile: path.resolve(__dirname, '../docs/openapi.json'),
  apiPrefix: '/api',
  // 完整的项目信息配置（Apifox 会导入这些信息）
  projectInfo: {
    title: 'Koa App Template API',
    version: '1.0.0',
    description: 'Koa 应用模板接口文档 - 基于 Koa.js 框架构建的 RESTful API 服务',
    contact: {
      name: 'koa-api',
      email: '1738248438@qq.com',
      url: 'https://github.com/your-repo/koa-app-template'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  // 多环境服务器配置（Apifox 会将这些导入为环境）
  servers: [
    {
      url: 'http://localhost:8080',
      description: '开发环境'
    },
    {
      url: 'http://test.api.example.com',
      description: '测试环境'
    },
    {
      url: 'http://api.example.com',
      description: '生产环境'
    }
  ]
}

/**
 * 递归扫描目录获取所有 JS 文件
 * @param {string} dir - 目录路径
 * @param {string} moduleName - 模块名称（文件夹名）
 * @returns {Array} 文件信息数组
 */
function scanDirectory(dir, moduleName = '') {
  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      files.push(...scanDirectory(fullPath, item.name))
    } else if (item.isFile() && item.name.endsWith('.js')) {
      files.push({
        path: fullPath,
        moduleName: moduleName || path.basename(item.name, '.js')
      })
    }
  }

  return files
}

/**
 * 解析 JSDoc 注释块
 * @param {string} content - 文件内容
 * @param {string} defaultModule - 默认模块名
 * @returns {Object} 解析结果，包含模块名和 API 数组
 */
function parseJsDocComments(content, defaultModule) {
  const apis = []

  const moduleMatch = content.match(/@module\s+(.+)/)
  const moduleName = moduleMatch ? moduleMatch[1].trim() : defaultModule

  const commentRegex = /\/\*\*[\s\S]*?\*\//g
  const comments = content.match(commentRegex) || []

  for (const comment of comments) {
    const api = parseApiComment(comment)
    if (api) {
      api.module = moduleName
      apis.push(api)
    }
  }

  return { moduleName, apis }
}

/**
 * 解析单个 API 注释块
 * @param {string} comment - 注释内容
 * @returns {Object|null} 解析后的 API 对象
 */
function parseApiComment(comment) {
  const apiMatch = comment.match(/@api\s+(\w+)\s+(\S+)/)
  if (!apiMatch) {
    return null
  }

  const [, method, apiPath] = apiMatch

  const summaryMatch = comment.match(/@summary\s+(.+)/)
  const summary = summaryMatch ? summaryMatch[1].trim() : ''

  const descMatch = comment.match(/@description\s+(.+)/)
  const description = descMatch ? descMatch[1].trim() : ''

  const params = parseParams(comment)
  const returns = parseReturns(comment)

  return {
    method: method.toUpperCase(),
    path: apiPath,
    summary,
    description,
    params,
    returns
  }
}

/**
 * 解析 @param 参数
 * @param {string} comment - 注释内容
 * @returns {Array} 参数数组
 */
function parseParams(comment) {
  const params = []
  const paramRegex = /@param\s+\{(\w+)\}\s+(\w+)\s*-?\s*(.*)/g
  let match

  while ((match = paramRegex.exec(comment)) !== null) {
    params.push({
      type: match[1].toLowerCase(),
      name: match[2],
      description: match[3].trim()
    })
  }

  return params
}

/**
 * 解析 @returns 返回值
 * @param {string} comment - 注释内容
 * @returns {Object|null} 返回值对象
 */
function parseReturns(comment) {
  const returnsMatch = comment.match(/@returns\s+\{(\w+)\}\s+(\d+)\s*-?\s*(.*)/)
  if (!returnsMatch) {
    return null
  }

  return {
    type: returnsMatch[1].toLowerCase(),
    code: parseInt(returnsMatch[2], 10),
    description: returnsMatch[3].trim()
  }
}

/**
 * 将 JSDoc 类型转换为 OpenAPI 类型
 * @param {string} jsDocType - JSDoc 类型
 * @param {string} paramName - 参数名称（用于生成更好的示例）
 * @returns {Object} OpenAPI schema 对象
 */
function convertToOpenApiType(jsDocType, paramName = '') {
  const typeMap = {
    string: { type: 'string', example: getExampleValue('string', paramName) },
    number: { type: 'number', example: getExampleValue('number', paramName) },
    integer: {
      type: 'integer',
      example: getExampleValue('integer', paramName)
    },
    boolean: { type: 'boolean', example: true },
    object: { type: 'object', example: {} },
    array: { type: 'array', items: { type: 'string' }, example: [] }
  }
  return typeMap[jsDocType] || { type: 'string', example: '' }
}

/**
 * 根据参数名和类型生成示例值
 * @param {string} type - 参数类型
 * @param {string} name - 参数名称
 * @returns {*} 示例值
 */
function getExampleValue(type, name) {
  const nameLower = name.toLowerCase()

  // 根据参数名称智能生成示例
  if (nameLower.includes('username') || nameLower.includes('name')) {
    return 'testuser'
  }
  if (nameLower.includes('password') || nameLower.includes('pwd')) {
    return 'Test123456'
  }
  if (nameLower.includes('email')) {
    return 'test@example.com'
  }
  if (nameLower.includes('phone') || nameLower.includes('mobile')) {
    return '13800138000'
  }
  if (nameLower.includes('id')) {
    return type === 'string' ? '1' : 1
  }
  if (nameLower.includes('page')) {
    return 1
  }
  if (nameLower.includes('size') || nameLower.includes('limit')) {
    return 10
  }

  // 默认值
  if (type === 'number' || type === 'integer') {
    return 0
  }
  return ''
}

/**
 * 转换为 OpenAPI 3.0 格式
 * @param {Object} moduleApis - 按模块分组的 API
 * @returns {Object} OpenAPI 3.0 格式的文档对象
 */
function convertToOpenApiFormat(moduleApis) {
  const openApiDoc = {
    openapi: '3.0.3',
    info: {
      title: CONFIG.projectInfo.title,
      version: CONFIG.projectInfo.version,
      description: CONFIG.projectInfo.description,
      contact: CONFIG.projectInfo.contact,
      license: CONFIG.projectInfo.license
    },
    servers: CONFIG.servers,
    tags: [],
    paths: {}
  }

  // 生成 tags（模块分组）
  for (const moduleName of Object.keys(moduleApis)) {
    openApiDoc.tags.push({
      name: moduleName,
      description: `${moduleName}相关接口`
    })
  }

  // 生成 paths
  for (const [moduleName, apis] of Object.entries(moduleApis)) {
    for (const api of apis) {
      const fullPath = CONFIG.apiPrefix + api.path

      if (!openApiDoc.paths[fullPath]) {
        openApiDoc.paths[fullPath] = {}
      }

      const operation = {
        tags: [moduleName],
        summary: api.summary,
        description: api.description,
        operationId: `${api.method.toLowerCase()}_${api.path.replace(/\//g, '_').replace(/[{}]/g, '')}`,
        responses: {
          200: {
            description: api.returns?.description || '请求成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'integer', description: '业务状态码' },
                    msg: { type: 'string', description: '响应消息' },
                    data: { type: 'object', description: '响应数据' }
                  }
                }
              }
            }
          }
        }
      }

      // 处理请求参数
      if (api.params.length > 0) {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(api.method)) {
          // POST/PUT/PATCH/DELETE 使用 requestBody
          const properties = {}
          const required = []
          const example = {}

          for (const param of api.params) {
            const schemaObj = convertToOpenApiType(param.type, param.name)
            properties[param.name] = {
              ...schemaObj,
              description: param.description
            }
            required.push(param.name)
            // 提取 example 用于整体示例
            example[param.name] = schemaObj.example
          }

          operation.requestBody = {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required,
                  properties
                },
                example
              }
            }
          }
        } else {
          // GET/DELETE 使用 query parameters
          operation.parameters = api.params.map((param) => {
            const schemaObj = convertToOpenApiType(param.type, param.name)
            return {
              name: param.name,
              in: 'query',
              required: true,
              description: param.description,
              schema: schemaObj,
              example: schemaObj.example
            }
          })
        }
      }

      openApiDoc.paths[fullPath][api.method.toLowerCase()] = operation
    }
  }

  return openApiDoc
}

/**
 * 扫描 controllers 目录并生成文档
 */
async function generateDocs() {
  console.log('🚀 开始生成 OpenAPI 文档（Apifox 格式）...\n')

  const moduleApis = {}
  const files = scanDirectory(CONFIG.controllersDir)

  for (const file of files) {
    const content = fs.readFileSync(file.path, 'utf-8')
    const relativePath = path.relative(CONFIG.controllersDir, file.path)

    console.log(`📄 解析文件: ${relativePath}`)

    const { moduleName, apis } = parseJsDocComments(content, file.moduleName)

    if (apis.length > 0) {
      if (!moduleApis[moduleName]) {
        moduleApis[moduleName] = []
      }
      moduleApis[moduleName].push(...apis)
      console.log(`   模块: ${moduleName}`)
      console.log(`   找到 ${apis.length} 个 API\n`)
    } else {
      console.log(`   未找到 API\n`)
    }
  }

  const totalApis = Object.values(moduleApis).flat().length

  if (totalApis === 0) {
    console.log('⚠️  未找到任何 API 文档')
    return
  }

  const openApiDoc = convertToOpenApiFormat(moduleApis)

  const outputDir = path.dirname(CONFIG.outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(openApiDoc, null, 2), 'utf-8')

  console.log(`✅ 文档生成成功！`)
  console.log(`📁 输出文件: ${CONFIG.outputFile}`)
  console.log(`📊 共计 ${Object.keys(moduleApis).length} 个模块，${totalApis} 个 API`)
  console.log(`\n💡 导入 Apifox 方式:`)
  console.log(`   1. 打开 Apifox 项目`)
  console.log(`   2. 点击 "设置" -> "导入数据"`)
  console.log(`   3. 选择 "OpenAPI/Swagger" -> "文件导入"`)
  console.log(`   4. 选择 ${CONFIG.outputFile} 文件`)
}

generateDocs().catch(console.error)
