/*
 * OpenAPI spec generator (no decorators, no JSDoc annotations)
 *
 * This generator introspects koa-router route stacks at runtime.
 * Limitation: it can auto-generate paths/methods, but cannot reliably infer
 * request/response schemas without additional metadata.
 */

const toOperationId = (method, routePath) => {
  const normalized = routePath
    .replace(/\{[^}]+\}/g, 'by')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()

  return `${method.toLowerCase()}_${normalized || 'root'}`
}

const guessTag = (routePath) => {
  const seg = routePath.split('/').filter(Boolean)[0]
  return seg || 'default'
}

const extractRoutesFromRouter = (router) => {
  if (!router || !Array.isArray(router.stack)) {
    return []
  }
  const prefix = (router.opts && router.opts.prefix) || ''

  return router.stack
    .filter((layer) => layer && layer.path && Array.isArray(layer.methods))
    .map((layer) => {
      const methods = layer.methods
        .map((m) => String(m).toLowerCase())
        // koa-router 会给 GET 自动加 HEAD，这里通常不需要展示
        .filter((m) => m !== 'head')

      return {
        path: `${prefix}${layer.path}`,
        methods
      }
    })
}

export const getOpenApiSpec = ({ routers, origin } = {}) => {
  const routerList = Array.isArray(routers) ? routers : [routers].filter(Boolean)
  const routes = routerList.flatMap(extractRoutesFromRouter)

  const paths = {}

  for (const route of routes) {
    if (!paths[route.path]) {
      paths[route.path] = {}
    }

    for (const method of route.methods) {
      if (paths[route.path][method]) {
        continue
      }

      const operation = {
        tags: [guessTag(route.path)],
        summary: `${method.toUpperCase()} ${route.path}`,
        operationId: toOperationId(method, route.path),
        responses: {
          200: { description: 'OK' }
        }
      }

      if (['post', 'put', 'patch'].includes(method)) {
        operation.requestBody = {
          required: false,
          content: {
            'application/json': {
              schema: { type: 'object', additionalProperties: true }
            }
          }
        }
      }

      paths[route.path][method] = operation
    }
  }

  return {
    openapi: '3.0.3',
    info: {
      title: 'koa2-app-template API',
      version: '1.0.0'
    },
    servers: [{ url: origin || 'http://localhost:8080' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'koa:sess'
        }
      }
    },
    paths
  }
}
