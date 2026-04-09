import { uploadDir } from './server.js'

/**
 * @koa/bodyparser 配置
 * 统一替代 koa-body，支持 JSON / Form / 文本以及 multipart 文件上传
 */
export const bodyParserConfig = {
  enableTypes: ['json', 'form', 'text', 'xml'],
  // 最大 body 大小（JSON / Form）
  jsonLimit: '10mb',
  formLimit: '10mb',
  // multipart 文件上传（通过 formidable）
  multipart: true,
  formidable: {
    uploadDir: uploadDir, // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀名
    maxFileSize: 10 * 1024 * 1024 // 文件最大 10MB
  }
}

// 向后兼容：默认导出保持不变
export default bodyParserConfig
