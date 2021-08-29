import { Context } from 'koa'
import * as Boom from '@hapi/boom'

export default () => {
  return async function errorHandle(ctx: Context, next) {
    try {
      await next()
    } catch (err) {
      console.log('中间件: ', err)
      if (!err) {
        err = Boom.badImplementation()
      }

      if (err.isBoom) {
        const { payload } = err.output
        ctx.status = payload.statusCode
        ctx.body = {
          code: payload.statusCode,
          message: payload.message ?? '空错误',
          data: err.data ?? 'no data',
        }
      } else {
        ctx.app.emit('error', err, ctx)
        const status = err.status || 500
        const message = err.message || 'Internal Server Error'

        // HTTP Code
        ctx.status = status

        // // 生产环境
        // const isProd = ctx.app.config.env === 'prod'

        // 错误响应对象
        ctx.body = {
          code: status,
          message: status === 500 ? 'Internal Server Error' : message,
          data: err.data ?? 'no data',
          // detail: status === 422 ? err.errors : undefined, // 参数校验未通过
        }
      }
    }
  }
}
