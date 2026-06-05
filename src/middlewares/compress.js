import koaCompress from 'koa-compress'
import { constants as zlibConstants } from 'zlib'

const compress = koaCompress({
  threshold: 2048,
  filter(contentType) {
    return ['application/javascript', 'application/json', 'text/css'].includes(contentType)
  },
  gzip: {
    flush: zlibConstants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: zlibConstants.Z_SYNC_FLUSH
  },
  br: false
})

export default compress
