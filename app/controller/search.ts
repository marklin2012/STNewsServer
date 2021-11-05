import * as Boom from '@hapi/boom'
import Moment from '../model/moment'
import Post from '../model/post'

import BaseController from './base_controller'

/**
 * @controller SearchController
 */

export default class SearchController extends BaseController {
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
    this.success({ moments: result, message: '搜索圈子成功' }, '搜索圈子成功')
  }
}
