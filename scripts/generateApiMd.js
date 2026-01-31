/**
 * @fileoverview 从 OpenAPI JSON 生成 API.md 文档
 * @description 解析 docs/openapi.json，生成 Markdown 格式的 API 文档
 *
 * 使用方式：node scripts/generateApiMd.js
 * 输出文件：docs/API.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
  inputFile: path.resolve(__dirname, '../docs/openapi.json'),
  outputFile: path.resolve(__dirname, '../docs/API.md')
}

/**
 * 生成 Markdown 文档
 * @param {Object} openApiDoc - OpenAPI 文档对象
 * @returns {string} Markdown 内容
 */
function generateMarkdown(openApiDoc) {
  const lines = []

  // 标题和描述
  lines.push(`# ${openApiDoc.info.title}`)
  lines.push('')
  lines.push(`> ${openApiDoc.info.description}`)
  lines.push('')
  lines.push(`**版本**: ${openApiDoc.info.version}`)
  lines.push('')

  // 服务器环境
  if (openApiDoc.servers && openApiDoc.servers.length > 0) {
    lines.push('## 🌐 服务器环境')
    lines.push('')
    lines.push('| 环境 | 地址 |')
    lines.push('| --- | --- |')
    for (const server of openApiDoc.servers) {
      lines.push(`| ${server.description} | \`${server.url}\` |`)
    }
    lines.push('')
  }

  // 按 tag 分组生成 API 文档
  const apisByTag = groupApisByTag(openApiDoc)

  // 目录（父子结构）
  lines.push('## 📑 目录')
  lines.push('')
  for (const tag of openApiDoc.tags || []) {
    const tagAnchor = tag.name.replace(/\s+/g, '-').toLowerCase()
    lines.push(`- [${tag.name}](#${tagAnchor})`)

    // 子级：该模块下的所有 API
    const apis = apisByTag[tag.name] || []
    for (const api of apis) {
      const apiAnchor = `${getMethodBadge(api.method).replace(/\s+/g, '-').toLowerCase()}-${api.summary.replace(/\s+/g, '-').toLowerCase()}`
      lines.push(`  - [${api.method} ${api.summary}](#${apiAnchor})`)
    }
  }
  lines.push('')

  for (const tag of openApiDoc.tags || []) {
    lines.push(`### ${tag.name}`)
    lines.push('')
    lines.push(`${tag.description}`)
    lines.push('')

    const apis = apisByTag[tag.name] || []

    for (const api of apis) {
      lines.push(...generateApiSection(api))
    }
  }

  // 联系信息
  if (openApiDoc.info.contact) {
    lines.push('---')
    lines.push('')
    lines.push('## 📧 联系方式')
    lines.push('')
    if (openApiDoc.info.contact.name) {
      lines.push(`- **联系人**: ${openApiDoc.info.contact.name}`)
    }
    if (openApiDoc.info.contact.email) {
      lines.push(`- **邮箱**: ${openApiDoc.info.contact.email}`)
    }
    if (openApiDoc.info.contact.url) {
      lines.push(`- **网站**: ${openApiDoc.info.contact.url}`)
    }
    lines.push('')
  }

  // 许可证
  if (openApiDoc.info.license) {
    lines.push('## 📄 许可证')
    lines.push('')
    lines.push(`本项目采用 [${openApiDoc.info.license.name}](${openApiDoc.info.license.url}) 许可证`)
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * 按 tag 分组 API
 * @param {Object} openApiDoc - OpenAPI 文档对象
 * @returns {Object} 按 tag 分组的 API
 */
function groupApisByTag(openApiDoc) {
  const apisByTag = {}

  for (const [path, methods] of Object.entries(openApiDoc.paths || {})) {
    for (const [method, operation] of Object.entries(methods)) {
      const tags = operation.tags || ['默认']

      for (const tag of tags) {
        if (!apisByTag[tag]) {
          apisByTag[tag] = []
        }
        apisByTag[tag].push({
          path,
          method: method.toUpperCase(),
          ...operation
        })
      }
    }
  }

  return apisByTag
}

/**
 * 生成单个 API 的 Markdown 内容
 * @param {Object} api - API 对象
 * @returns {string[]} Markdown 行数组
 */
function generateApiSection(api) {
  const lines = []
  const methodBadge = getMethodBadge(api.method)

  lines.push(`#### ${methodBadge} ${api.summary}`)
  lines.push('')
  lines.push(`\`${api.method} ${api.path}\``)
  lines.push('')

  if (api.description) {
    lines.push(`**描述**: ${api.description}`)
    lines.push('')
  }

  // 请求参数 - Query Parameters
  if (api.parameters && api.parameters.length > 0) {
    lines.push('##### 请求参数 (Query)')
    lines.push('')
    lines.push('| 参数名 | 类型 | 必填 | 描述 | 示例 |')
    lines.push('| :---: | :---: | :---: | :---: | :---: |')

    for (const param of api.parameters) {
      const required = param.required ? '✅' : '❌'
      const type = param.schema?.type || 'string'
      const example = param.example ?? param.schema?.example ?? '-'
      lines.push(`| \`${param.name}\` | ${type} | ${required} | ${param.description || '-'} | \`${example}\` |`)
    }
    lines.push('')
  }

  // 请求参数 - Request Body
  if (api.requestBody) {
    const content = api.requestBody.content?.['application/json']
    if (content) {
      lines.push('##### 请求参数 (Body)')
      lines.push('')
      lines.push('**Content-Type**: `application/json`')
      lines.push('')

      const schema = content.schema
      if (schema?.properties) {
        lines.push('| 参数名 | 类型 | 必填 | 描述 | 示例 |')
        lines.push('| :---: | :---: | :---: | :---: | :---: |')

        const requiredFields = schema.required || []

        for (const [name, prop] of Object.entries(schema.properties)) {
          const required = requiredFields.includes(name) ? '✅' : '❌'
          const type = prop.type || 'string'
          const example = prop.example ?? '-'
          lines.push(`| \`${name}\` | ${type} | ${required} | ${prop.description || '-'} | \`${example}\` |`)
        }
        lines.push('')
      }

      // 请求示例
      if (content.example) {
        lines.push('**请求示例**:')
        lines.push('')
        lines.push('```json')
        lines.push(JSON.stringify(content.example, null, 2))
        lines.push('```')
        lines.push('')
      }
    }
  }

  // 响应
  if (api.responses) {
    lines.push('##### 响应')
    lines.push('')

    for (const [code, response] of Object.entries(api.responses)) {
      lines.push(`**${code}** - ${response.description}`)
      lines.push('')

      const content = response.content?.['application/json']
      if (content?.schema) {
        lines.push('```json')
        lines.push(JSON.stringify(generateSchemaExample(content.schema), null, 2))
        lines.push('```')
        lines.push('')
      }
    }
  }

  lines.push('---')
  lines.push('')

  return lines
}

/**
 * 获取 HTTP 方法的 Badge
 * @param {string} method - HTTP 方法
 * @returns {string} Badge 字符串
 */
function getMethodBadge(method) {
  const badges = {
    GET: '� GET',
    POST: '📝 POST',
    PUT: '🔄 PUT',
    PATCH: '✏️ PATCH',
    DELETE: '🗑️ DELETE'
  }
  return badges[method] || method
}

/**
 * 根据 Schema 生成示例数据
 * @param {Object} schema - JSON Schema
 * @returns {Object} 示例数据
 */
function generateSchemaExample(schema) {
  if (!schema) {
    return {}
  }

  if (schema.example) {
    return schema.example
  }

  if (schema.type === 'object' && schema.properties) {
    const example = {}
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.example !== undefined) {
        example[key] = prop.example
      } else if (prop.type === 'integer') {
        example[key] = 0
      } else if (prop.type === 'number') {
        example[key] = 0.0
      } else if (prop.type === 'boolean') {
        example[key] = true
      } else if (prop.type === 'array') {
        example[key] = []
      } else if (prop.type === 'object') {
        example[key] = {}
      } else {
        example[key] = ''
      }
    }
    return example
  }

  return {}
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始生成 API.md 文档...\n')

  // 检查输入文件
  if (!fs.existsSync(CONFIG.inputFile)) {
    console.error(`❌ 未找到 OpenAPI 文件: ${CONFIG.inputFile}`)
    console.log('   请先运行 npm run docs:apifox 生成 OpenAPI 文档')
    process.exit(1)
  }

  // 读取 OpenAPI 文档
  const openApiContent = fs.readFileSync(CONFIG.inputFile, 'utf-8')
  const openApiDoc = JSON.parse(openApiContent)

  console.log(`📄 读取文件: ${CONFIG.inputFile}`)
  console.log(`   标题: ${openApiDoc.info.title}`)
  console.log(`   版本: ${openApiDoc.info.version}`)

  // 统计 API 数量
  let apiCount = 0
  for (const methods of Object.values(openApiDoc.paths || {})) {
    apiCount += Object.keys(methods).length
  }
  console.log(`   API 数量: ${apiCount}`)

  // 生成 Markdown
  const markdown = generateMarkdown(openApiDoc)

  // 写入文件
  const outputDir = path.dirname(CONFIG.outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(CONFIG.outputFile, markdown, 'utf-8')

  console.log(`\n✅ 文档生成成功！`)
  console.log(`📁 输出文件: ${CONFIG.outputFile}`)
  console.log(`\n💡 你可以在 README.md 中添加链接: [API 文档](docs/API.md)`)
}

main().catch(console.error)
