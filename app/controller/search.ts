import * as Boom from '@hapi/boom'
import { includes } from 'lodash'
import Moment from '../model/moment'
import Post from '../model/post'
import BaseController from './base_controller'

/**
 * @controller SearchController
 */

const SearchMomentHotKey = 'search_moment_hot_key'
export default (app) =>
  class SearchController extends BaseController {
    /**
     * @summary 搜索文章标题
     * @description
     * @router get /search
     * @request query string *key 搜索内容
     * @response 200 responseBody 返回值
     */
    public async search() {
      const { ctx } = this
      ctx.validate(
        {
          key: { type: 'string', required: true },
        },
        ctx.query
      )
      const { key } = ctx.request.query
      const { per_page, skip } = ctx.state

      const result = await Post.find({
        title: { $regex: key, $options: 'i' },
      })
        .populate('author')
        .limit(per_page)
        .skip(skip)
        .lean()
      if (!result) {
        throw Boom.badData('搜索文章失败')
      }
      this.success({ posts: result, message: '搜索文章成功' }, '搜索文章成功')
    }

    /**
     * @summary 搜索圈子标题
     * @description
     * @router get /search/moment
     * @request query string *key 搜索内容
     * @response 200 responseBody 返回值
     */
    public async searchMoment() {
      const { ctx } = this
      ctx.validate(
        {
          key: { type: 'string', required: true },
        },
        ctx.query
      )
      const { key } = ctx.request.query
      const { per_page, skip } = ctx.state

      const result = await Moment.find({
        title: { $regex: key, $options: 'i' },
      })
        .populate('user')
        .limit(per_page)
        .skip(skip)
        .lean()
      if (!result) {
        throw Boom.badData('搜索圈子失败')
      }
      // 如果搜索结果存在内容，则缓存当次搜索内容
      if (result.length > 0) {
        const hotKeys =
          (await app.redis.lrange(SearchMomentHotKey, 0, -1)) ?? []
        // 如果热门搜索的key不包含在之前记录中，则保存key
        if (!includes(hotKeys, key)) {
          await app.redis.lpush(SearchMomentHotKey, key)
          // 热门搜索的 key 维持最多 10条
          // 这里注意新加入的词条还没记录进去，所以判断要大于等于
          if (hotKeys.length >= 10) {
            await app.redis.rpop(SearchMomentHotKey)
          }
        }
      }

      this.success({ moments: result, message: '搜索圈子成功' }, '搜索圈子成功')
    }

    /**
     * @summary 热门圈子搜索标题
     * @description
     * @router get /search/moment/hot
     * @response 200 responseBody 返回值
     */
    public async momentHotKeys() {
      const hotKeys = (await app.redis.lrange(SearchMomentHotKey, 0, -1)) ?? []
      this.success({
        hotKeys,
      })
    }
  }
