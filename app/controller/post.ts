import * as Boom from '@hapi/boom'
import Notification from '../model/notification'
import Post from '../model/post'
import PostFavourite from '../model/post_favourite'
import PostThumbup from '../model/post_thumbup'
import User from '../model/user'
import BaseController from './base_controller'

/**
 * @controller PostController
 */

export default class PostController extends BaseController {
  /**
   * @summary 创建文章列表
   * @description
   * @router post /post/add
   * @request formData string *title 标题
   * @request formData string *article 文章内容
   * @request formData string *cover_image 封面图片
   * @response 200 responseBody 返回值
   */
  public async add() {
    const { ctx } = this
    ctx.validate({
      title: { type: 'string', required: true },
      article: { type: 'string', required: true },
      cover_image: { type: 'string', required: false },
    })
    const { title, article, cover_image } = ctx.request.body
    const { id } = ctx.state.user
    const result = await Post.create({
      author: id,
      title,
      article,
      cover_image,
      published_date: new Date(),
    })
    if (!result) {
      throw Boom.badData('创建文章失败')
    }
    this.success({ ok: 1, message: '创建文章成功' }, '文章创建成功')
  }
  /**
   * @summary 获取文章列表
   * @description
   * @router get /post/list
   * @response 200 responseBody 返回值
   */
  public async list() {
    const { ctx } = this
    const { per_page, skip } = ctx.state
    const result = await Post.find()
      .populate('author')
      .limit(per_page)
      .skip(skip)
      .lean()
    this.success(result)
  }

  /**
   * @summary 获取 Banner 列表
   * @description
   * @router get /post/banner
   * @response 200 responseBody 返回值
   */
  public async bannerList() {
    const result = await Post.find().limit(5).populate('author').lean()
    this.success(result, '成功拉取 Banner 列表')
  }

  /**
   * @summary 获取文章详情
   * @description
   * @router get /post/:id
   * @request params id *id 文章id
   * @response 200 responseBody 返回值
   */
  public async getPostById() {
    const { ctx } = this
    ctx.validate(
      {
        _id: { type: 'string', required: true },
      },
      ctx.params
    )
    const { _id } = ctx.params
    const res = await Post.findById(_id).populate('author').lean()
    if (!res) {
      throw Boom.badData('文章可能不存在， 请确认后重新获取')
    }
    this.success({ post: res }, '获取文章详情成功')
  }

  /**
   * @summary 收藏文章
   * @description
   * @router put /post/favourite
   * @request formData id *post 文章id
   * @request formData bool status 是否收藏
   * @response 200 responseBody 返回值
   */
  public async favouritePost() {
    const { ctx } = this
    ctx.validate({
      post: { type: 'string', required: true },
      status: { type: 'bool', required: false, default: true },
    })
    const { post, status } = ctx.request.body
    const { id } = ctx.state.user
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
      },
      { new: true, upsert: true, timestamps: true }
    )
    // 添加收藏消息
    try {
      const user = await User.findById(id)
      const postObj = await Post.findById(post)
      if (user && postObj) {
        await Notification.create({
          type: 'fav',
          recipientID: postObj.author,
          description: `${user.nickname}收藏了您的文章 《${postObj.title}》`,
        })
      }
    } catch (err) {}

    const message = status ? '已收藏该文章' : '已取消收藏该文章'
    this.success({ isFavourite: status }, message)
  }

  /**
   * @summary 点赞文章
   * @description
   * @router put /post/thumbup
   * @request formData id *post 文章id
   * @request formData bool status 是否点赞
   * @response 200 responseBody 返回值
   */
  public async thumbupPost() {
    const { ctx } = this
    ctx.validate({
      post: { type: 'string', required: true },
      status: { type: 'bool', required: false, default: true },
    })
    const { post, status } = ctx.request.body
    const { id } = ctx.state.user

    await PostThumbup.findOneAndUpdate(
      { post, user: id },
      {
        $setOnInsert: {
          post,
          user: id,
        },
        $set: {
          status,
        },
      },
      { new: true, upsert: true }
    )
    // 添加点赞消息
    try {
      const user = await User.findById(id)
      const postObj = await Post.findById(post)
      if (user && postObj) {
        await Notification.create({
          type: 'up',
          recipientID: postObj.author,
          description: `${user.nickname}点赞了您的文章 《${postObj.title}》`,
        })
      }
    } catch (err) {}
    const message = status ? '已点赞该文章' : '已取消点赞该文章'
    this.success({ isThumbup: status }, message)
  }

  /**
   * @summary 是否点赞文章
   * @description
   * @router get /post/thumbup/:id
   * @request params id *_id 文章id
   * @response 200 responseBody 返回值
   */
  public async isThumbupPost() {
    const { ctx } = this
    ctx.validate(
      {
        _id: { type: 'string', required: true },
      },
      ctx.params
    )
    const { _id: postId } = ctx.params
    const { id: userId } = ctx.state.user
    try {
      const res = await PostThumbup.findOne({
        post: postId,
        user: userId,
        status: true,
      })
      if (!res) {
        this.success({ isThumbup: false }, '该文章未点赞')
      } else {
        this.success({ isThumbup: true }, '该文章已点赞')
      }
    } catch (err) {
      throw Boom.badData('用户或文章可能不存在，请稍后再试')
    }
  }

  /**
   * @summary 是否收藏文章
   * @description
   * @router get /post/favourite/:id
   * @request params id *_id 文章id
   * @response 200 responseBody 返回值
   */
  public async isFavouritePost() {
    const { ctx } = this
    ctx.validate(
      {
        _id: { type: 'string', required: true },
      },
      ctx.params
    )
    const { _id: postId } = ctx.params
    const { id: userId } = ctx.state.user
    try {
      const res = await PostFavourite.findOne({
        post: postId,
        user: userId,
        status: true,
      })
      if (!res) {
        this.success({ isFavourite: false }, '该文章未收藏')
      } else {
        this.success({ isFavourite: true }, '该文章已收藏')
      }
    } catch (err) {
      throw Boom.badData('用户或文章可能不存在，请稍后再试')
    }
  }
}
