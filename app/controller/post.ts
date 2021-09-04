import * as Boom from '@hapi/boom'
import Post from '../model/post'
import PostFavourite from '../model/post_favourite'
import BaseController from './base_controller'

/**
 * @controller PostController
 */

export default class PostController extends BaseController {
  /**
   * @summary 获取文章列表
   * @description
   * @router get /post/list
   * @response 200 responseBody 返回值
   */
  public async list() {
    const { ctx } = this
    const { per_page, skip } = ctx.state
    const result = await Post.find().limit(per_page).skip(skip).lean()
    this.success(result)
  }

  /**
   * @summary 获取文章详情
   * @description
   * @router get /post/:id
   * @request params id _id 文章id
   * @response 200 responseBody 返回值
   */
  public async getPostById() {
    const { ctx } = this
    ctx.validate(
      {
        _id: { type: 'id', required: true },
      },
      ctx.params
    )
    const { _id } = ctx.params
    const res = await Post.findById(_id).lean()
    if (!res) {
      throw Boom.badData('文章可能不存在， 请确认后重新获取')
    }
    this.success({ post: res }, '获取文章详情成功')
  }

  /**
   * @summary 收藏文章
   * @description
   * @router put /post/favourite
   * @response 200 responseBody 返回值
   */
  public async favouritePost() {
    const { ctx } = this
    ctx.validate({
      post: { type: 'id', required: true },
      status: { type: 'bool', required: false, default: true },
    })
    const { post, status } = ctx.request.body
    const { id } = ctx.state.user
    try {
      await PostFavourite.findOneAndUpdate(
        { post, user: id },
        {
          $setOnInsert: {
            post,
            user: id,
          },
          $set: {
            status,
          },
        }
      )
      const message = status ? '已收藏该文章' : '已取消收藏该文章'
      this.success('操作成功', message)
    } catch (err) {
      throw Boom.badData('用户或文章可能不存在，请稍后再试')
    }
  }
}
