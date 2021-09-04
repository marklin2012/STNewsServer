import * as Boom from '@hapi/boom'
import BaseController from './base_controller'
import Comment from '../model/comment'
/**
 * @controller CommentController
 */
export default class CommentController extends BaseController {
  /**
   * @summary 创建文章评论
   * @description
   * @router post /comment/add
   * @request formData string *post 文章id
   * @request formData string *content 评论内容
   * @response 200 responseBody 返回值
   */
  public async addComment() {
    const { ctx } = this
    ctx.validate({
      content: { type: 'string', required: true, max: 500 },
      post: { type: 'id', required: true },
    })
    const { content, post } = ctx.request.body
    const { id } = ctx.state.user
    const res = await Comment.create({
      post,
      content,
      user: id,
    })
    if (!res) {
      throw Boom.badData('评论创建失败，请稍后再试')
    }
    this.success({ comment: res.toJSON() }, '成功创建评论')
  }

  /**
   * @summary 创建文章评论
   * @description
   * @router post /comment/list
   * @request query string *post 文章id
   * @response 200 responseBody 返回值
   */
  public async getCommentList() {
    const { ctx } = this
    ctx.validate(
      {
        post: { type: 'id', required: true },
      },
      ctx.query
    )

    const { post } = ctx.query

    const { per_page, skip } = ctx.state
    const res = await Comment.find({
      post,
      deleted: false,
    })
      .limit(per_page)
      .skip(skip)
      .populate('post', 'user')
      .lean()

    if (!res) {
      throw Boom.badData('找不到评论')
    }
    this.success(
      {
        comments: res,
      },
      '获取评论列表'
    )
  }
}
