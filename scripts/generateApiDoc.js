/**
 * @fileoverview 基于 Controller JSDoc 注释自动生成 OpenAPI 3.0 文档（Apifox 可直接导入）
 * @description 复用 src/plugins/openapi/parser.js 的 scanControllers，输出 docs/openapi.json
 *
 * 支持的 JSDoc 标签：
 *   @api METHOD /path          — 接口路由（必须）
 *   @description 标签名 - 描述  — API 分组（必须）
 *   @auth public|secured        — 是否需要鉴权（默认 secured）
 *   @body {type} name - 描述    — 请求体字段
 *   @query {type} name - 描述   — 查询参数
 *
 * 使用方式：node scripts/generateApiDoc.js
 * 输出文件：docs/openapi.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { scanControllers } from '../src/plugins/openapi/parser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
  controllersDir: path.resolve(__dirname, '../src/controllers'),
  outputFile: path.resolve(__dirname, '../docs/openapi.json'),
  apiPrefix: '/api',
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
  servers: [
    { url: 'http://localhost:8080', description: '开发环境' },
    { url: 'http://test.api.example.com', description: '测试环境' },
    { url: 'http://api.example.com', description: '生产环境' }
  ]
}

/** 根据参数名智能生成示例值 */
const getExampleValue = (type, name) => {
  const n = name.toLowerCase()
  if (n.includes('username') || n.includes('name')) {
    return 'testuser'
  }
  if (n.includes('password') || n.includes('pwd')) {
    return 'Test123456'
  }
  if (n.includes('email')) {
    return 'test@example.com'
  }
  if (n.includes('phone') || n.includes('mobile')) {
    return '13800138000'
  }
  if (n.includes('id')) {
    return type === 'string' ? '1' : 1
  }
  if (n.includes('page')) {
    return 1
  }
  if (n.includes('size') || n.includes('limit')) {
    return 10
  }
  if (type === 'number' || type === 'integer') {
    return 0
  }
  return ''
}

/** 为 schema 属性补充 example */
const enrichWithExample = (schema, name) => {
  if (!schema || !name) {
    return schema
  }
  const example = getExampleValue(schema.type, name)
  return { ...schema, example }
}

/** 为 operation 补充 operationId 和 example */
const enrichOperation = (method, routePath, operation) => {
  // operationId
  const operationId = `${method}${routePath.replace(/\//g, '_')}`

  // requestBody 补充 example
  let requestBody = operation.requestBody
  if (requestBody?.content?.['application/json']?.schema?.properties) {
    const schema = requestBody.content['application/json'].schema
    const example = {}
    const enrichedProps = {}
    for (const [key, prop] of Object.entries(schema.properties)) {
      const ex = getExampleValue(prop.type, key)
      enrichedProps[key] = { ...prop, example: ex }
      example[key] = ex
    }
    requestBody = {
      ...requestBody,
      content: {
        'application/json': {
          schema: { ...schema, properties: enrichedProps },
          example
        }
      }
    }
  }

  // parameters 补充 example
  let parameters = operation.parameters
  if (parameters) {
    parameters = parameters.map((p) => ({
      ...p,
      schema: enrichWithExample(p.schema, p.name),
      example: getExampleValue(p.schema?.type, p.name)
    }))
  }

  // responses 补充 description 和 data 字段
  const responses = {
    200: {
      description: operation.summary ? `${operation.summary}成功` : '请求成功',
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

  return {
    ...operation,
    operationId,
    ...(requestBody ? { requestBody } : {}),
    ...(parameters ? { parameters } : {}),
    responses
  }
}

/**
 * 扫描 Controller 注释并生成 OpenAPI 文档
 */
async function generateDocs() {
  console.log('🚀 开始生成 OpenAPI 文档（Apifox 格式）...\n')

  const { tags, paths } = scanControllers(CONFIG.controllersDir)

  // 为 paths 添加 api 前缀，并补充 operationId / example
  const enrichedPaths = {}
  let apiCount = 0
  for (const [routePath, methods] of Object.entries(paths)) {
    const fullPath = CONFIG.apiPrefix + routePath
    enrichedPaths[fullPath] = {}
    for (const [method, operation] of Object.entries(methods)) {
      enrichedPaths[fullPath][method] = enrichOperation(method, routePath, operation)
      apiCount++
    }
  }

  const openApiDoc = {
    openapi: '3.0.3',
    info: CONFIG.projectInfo,
    servers: CONFIG.servers,
    tags,
    paths: enrichedPaths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }

  // 写入文件
  const outputDir = path.dirname(CONFIG.outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(openApiDoc, null, 2), 'utf-8')

  console.log(`✅ 文档生成成功！`)
  console.log(`📁 输出文件: ${CONFIG.outputFile}`)
  console.log(`📊 共计 ${tags.length} 个分组，${apiCount} 个 API`)
  console.log(`\n💡 导入 Apifox 方式:`)
  console.log(`   1. 打开 Apifox 项目`)
  console.log(`   2. 点击 "设置" -> "导入数据"`)
  console.log(`   3. 选择 "OpenAPI/Swagger" -> "文件导入"`)
  console.log(`   4. 选择 ${CONFIG.outputFile} 文件`)
}

generateDocs().catch(console.error)
