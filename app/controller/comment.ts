import * as Boom from '@hapi/boom'
import BaseController from './base_controller'
import Comment from '../model/comment'
import CommentFavourite from '../model/comment_favourite'
import { map } from 'lodash'
import User from '../model/user'
import Notification from '../model/notification'
import Post from '../model/post'

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

    // 添加评论消息
    try {
      const user = await User.findById(id)
      const postObj = await Post.findById(post)
      if (user && postObj) {
        await Notification.create({
          type: 'comment',
          recipientID: postObj.author,
          description: `${user.nickname}评论了您的文章 《${postObj.title}》`,
        })
      }
    } catch (err) {
      console.log(err)
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
    const { id } = ctx.state.user
    const comments = await Comment.find({
      post,
      deleted: false,
    })
      .limit(per_page)
      .skip(skip)
      .populate({ path: 'post', populate: { path: 'author' } })
      .populate('user')
      .lean()

    if (!comments) {
      throw Boom.badData('找不到评论')
    }
    const res = await Promise.all(
      map(comments, async (comment) => {
        let isFavComment = false
        const commentFav = await CommentFavourite.findOne({
          comment: comment._id,
          user: id,
          status: true,
        })
        if (commentFav) {
          isFavComment = true
        }
        const commentFavCount = await CommentFavourite.count({
          comment: comment._id,
          status: true,
        })
        return {
          ...comment,
          isUserFavourite: isFavComment,
          favouriteCount: commentFavCount,
        }
      })
    )
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

    // 添加点赞评论消息
    try {
      const user = await User.findById(id)
      const commentObj = await Comment.findById(comment)
      if (commentObj) {
        const postObj = await Post.findById(commentObj.post)
        if (user && postObj) {
          await Notification.create({
            type: 'comment',
            recipientID: comment.user,
            description: `${user.nickname}点赞了您对文章 《${postObj.title}》的评论`,
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
    const message = status ? '已收藏该评论' : '已取消收藏该评论'
    this.success('操作成功', message)
  }
}
