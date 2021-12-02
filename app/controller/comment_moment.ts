import * as Boom from '@hapi/boom'
import BaseController from './base_controller'
import CommentFavourite from '../model/comment_favourite'
import { map } from 'lodash'
import User from '../model/user'
import Notification from '../model/notification'
import CommentMoment from '../model/comment_moment'
import Moment from '../model/moment'
import CommentMomentFavourite from '../model/comment_moment_favourite'

/**
 * @controller CommentMomentController
 */
export default class CommentMomentController extends BaseController {
  /**
   * @summary 创建圈子评论
   * @description
   * @router post /comment_moment/add
   * @request formData string *moment 圈子id
   * @request formData string *content 评论内容
   * @request formData string reference 隶属哪条评论(在哪条评论下进行回复)
   * @request formData string comment 回复哪条评论（是否回复）
   * @response 200 responseBody 返回值
   */
  public async addComment() {
    const { ctx } = this
    ctx.validate({
      content: { type: 'string', required: true, max: 500 },
      moment: { type: 'string', required: true },
      comment: { type: 'string', required: false, default: null },
      reference: { type: 'string', required: false, default: null },
    })
    const { moment, content, comment, reference } = ctx.request.body
    const { id } = ctx.state.user
    const res = await CommentMoment.create({
      content,
      moment,
      comment,
      reference,
      user: id,
      published_date: Date(),
    })
    if (!res) {
      throw Boom.badData('圈子评论创建失败，请稍后再试')
    }

    // 添加评论消息
    try {
      const user = await User.findById(id)
      const momentObj = await Moment.findById(moment)
      if (user && momentObj) {
        await Notification.create({
          type: 'comment',
          recipientID: momentObj.user,
          description: `${user.nickname}评论了您的圈子 《${momentObj.title}》`,
        })
      }
    } catch (err) {
      console.log(err)
    }
    this.success({ comment: res.toJSON() }, '成功创建评论')
  }

  /**
   * @summary 获取圈子评论列表
   * @description
   * @router get /comment_moment/list
   * @request query string *moment 圈子id
   * @response 200 responseBody 返回值
   */
  public async getCommentList() {
    const { ctx } = this
    ctx.validate(
      {
        moment: { type: 'string', required: true },
      },
      ctx.query
    )

    const { moment } = ctx.query

    const { per_page, skip } = ctx.state
    const { id } = ctx.state.user
    const comments = await CommentMoment.find({
      moment,
      deleted: false,
      reference: null,
    })
      .limit(per_page)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate({ path: 'moment', populate: { path: 'user' } })
      .populate('user')
      .populate({ path: 'comment', populate: { path: 'user' } })
      .populate({ path: 'reference', populate: { path: 'user' } })
      .lean()

    if (!comments) {
      throw Boom.badData('找不到圈子评论')
    }
    const res = await Promise.all(
      map(comments, async (comment) => {
        // 查找子评论
        const refComments = await CommentMoment.find({
          moment,
          reference: comment._id,
          deleted: false,
        })
          .populate({ path: 'moment', populate: { path: 'user' } })
          .populate('user')
          .populate({ path: 'comment', populate: { path: 'user' } })
          .populate({ path: 'reference', populate: { path: 'user' } })
          .lean()
        const results = await Promise.all(
          map(refComments, async (refComment) => {
            let isFavComment = false
            const commentFav = await CommentFavourite.findOne({
              comment: refComment._id,
              user: id,
              status: true,
            })
            if (commentFav) {
              isFavComment = true
            }
            const commentFavCount = await CommentFavourite.count({
              comment: refComment._id,
              status: true,
            })
            return {
              ...refComment,
              isUserFavourite: isFavComment,
              favouriteCount: commentFavCount,
            }
          })
        )

        // 查找评论
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
          references: results,
          isUserFavourite: isFavComment,
          favouriteCount: commentFavCount,
        }
      })
    )

    const totalCounts = await CommentMoment.count({
      moment,
      deleted: false,
    })
    this.success(
      {
        comments: res,
        totalCounts,
      },
      '获取评论列表'
    )
  }

  /**
   * @summary 点赞圈子评论
   * @description
   * @router post /comment_moment/favourite
   * @request formData string *comment 评论id
   * @request formData string status 是否点赞 true 点赞， false 取消点赞
   * @response 200 responseBody 返回值
   */
  public async favouriteComment() {
    const { ctx } = this
    ctx.validate({
      comment: { type: 'string', required: true },
      status: { type: 'bool', required: false, default: true },
    })
    const { comment, status } = ctx.request.body
    const { id } = ctx.state.user

    await CommentMomentFavourite.findOneAndUpdate(
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
      const commentObj = await CommentMoment.findById(comment)
      if (commentObj) {
        const momentObj = await Moment.findById(commentObj.moment)
        if (user && momentObj) {
          await Notification.create({
            type: 'comment',
            recipientID: comment.user,
            description: `${user.nickname}点赞了您对圈子 《${momentObj.title}》的评论`,
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
    const message = status ? '已点赞该评论' : '已取消点赞该评论'
    this.success('操作成功', message)
  }
}
