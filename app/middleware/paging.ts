import { Context } from 'koa'
import { min } from 'lodash'

const DEFAULT_PER_PAGE = 10
const MAX_PER_PAGE = 30
const DEFAULT_PAGE_NUM = 1

function paging(ctx: Context, next) {
  if (ctx.method == 'GET') {
    const { query } = ctx
    const limit =
      min([
        Math.abs(parseInt(query.per_page)) || DEFAULT_PER_PAGE,
        MAX_PER_PAGE,
      ]) || DEFAULT_PER_PAGE
    const page = Math.abs(parseInt(query.page)) || DEFAULT_PAGE_NUM
    ctx.state.per_page = limit
    ctx.state.page = page
    ctx.state.skip = (page - 1) * (limit || DEFAULT_PER_PAGE)
    delete ctx.query.per_page
    delete ctx.query.page
  }
  return next()
}

export default () => paging
