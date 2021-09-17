import * as Boom from '@hapi/boom'
import BaseController from './base_controller'
import Comment from '../model/comment'
import CommentFavourite from '../model/comment_favourite'
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
      post: { type: 'string', required: true },
    })
    const { content, post } = ctx.request.body
    const { id } = ctx.state.user
    const res = await Comment.create({
      post,
      content,
      user: id,
      published_date: Date(),
    })
    if (!res) {
      throw Boom.badData('评论创建失败，请稍后再试')
    }
    this.success({ comment: res.toJSON() }, '成功创建评论')
  }

  /**
   * @summary 获取文章评论列表
   * @description
   * @router get /comment/list
   * @request query string *post 文章id
   * @response 200 responseBody 返回值
   */
  public async getCommentList() {
    const { ctx } = this
    ctx.validate(
      {
        post: { type: 'string', required: true },
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

  /**
   * @summary 点赞评论
   * @description
   * @router post /comment/favourite
   * @request formData string *comment 评论id
   * @request formData string status 是否点赞 true 点赞， false 取消点赞
   * @response 200 responseBody 返回值
   */
  public async favouriteComment() {
    const { ctx } = this
    ctx.validate({
      comment: { type: 'string', required: true },
      status: { type: 'bool', required: false, default: false },
    })
    const { comment, status } = ctx.request.body
    const { id } = ctx.state.user

    try {
      await CommentFavourite.findOneAndUpdate(
        { comment, user: id },
        {
          $setOnInsert: {
            comment,
            user: id,
          },
          $set: {
            status,
          },
        },
        { new: true, upsert: true }
      )
      const message = status ? '已收藏该评论' : '已取消收藏该评论'
      this.success('操作成功', message)
    } catch (err) {
      throw Boom.badData('用户或文章可能不存在，请稍后再试')
    }
  }
}
