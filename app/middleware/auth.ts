import { Context } from 'koa'
import { includes } from 'lodash'
import authRoutes from '../constants/auth_routes'
import * as Boom from '@hapi/boom'

export default (app) => {
  return async function (ctx: Context, next) {
    const { url } = ctx
    console.log('xxx', url)
    // 如果包含 路径， 则跳过 auth 验证
    if (includes(authRoutes, url)) {
      console.log('白名单')
      await next()
    } else {
      const token = ctx.header.authorization
        ? (ctx.header.authorization as string)
        : ''
      try {
        const decode = await app.jwt.verify(token, app.config.jwt.secret)
        ctx.state.userinfo = decode
        console.log('校验成功')
        await next()
      } catch (err) {
        throw Boom.unauthorized('用户授权失败')
      }
    }
  }
}