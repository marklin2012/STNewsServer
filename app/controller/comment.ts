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
   * @router post /post/list
   * @request formData string *post 验证码
   * @request formData string *content 验证码
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
}
