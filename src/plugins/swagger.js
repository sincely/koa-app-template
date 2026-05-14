import path from 'path'
import { fileURLToPath } from 'url'
import { koaSwagger } from 'koa2-swagger-ui'
import { scanControllers } from './openapi/parser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const serverPort = Number.parseInt(String(process.env.PORT ?? ''), 10) || 8080

/** 构建 OpenAPI 规范：扫描 Controller 注释自动生成 */
const buildSwaggerSpec = () => {
  const { tags, paths } = scanControllers(path.join(__dirname, '../controllers'))

  return {
    openapi: '3.0.0',
    info: {
      title: 'Koa2 快速启动模板 API',
      version: '1.0.0',
      description: 'Koa2 快速启动模板接口文档'
    },
    servers: [
      {
        url: `http://localhost:${serverPort}/api`,
        description: '本地开发环境'
      }
    ],
    tags,
    paths,
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
}

const swaggerSpec = buildSwaggerSpec()

/** 注册 SwaggerUI，默认访问地址：http://localhost:{port}/docs */
export const registerSwagger = (app) => {
  app.use(
    koaSwagger({
      routePrefix: '/docs',
      swaggerOptions: {
        spec: swaggerSpec
      },
      hideTopbar: true
    })
  )
}
