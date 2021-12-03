import * as Boom from '@hapi/boom'
import Moment from '../model/moment'
import MomentFavourite from '../model/moment_favourite'
import MomentThumbup from '../model/moment_thumbup'
import Notification from '../model/notification'
import User from '../model/user'
import BaseController from './base_controller'
import { identity, map, pickBy } from 'lodash'

/**
 * @controller MomentController
 */

export default class MomentController extends BaseController {
  /**
   * @summary 创建圈子列表
   * @description 当 visibles 数组为空时，对所有人可见,
   * @router post /moment/add
   * @request formData string *title 标题
   * @request formData string *content 圈子内容
   * @request formData string images 圈子图片
   * @request formData string visibles 可见权限
   * @response 200 responseBody 返回值
   */
  public async add() {
    const { ctx } = this
    ctx.validate({
      title: { type: 'string', required: true },
      content: { type: 'string', required: true },
      images: { type: 'array', itemType: 'string', required: false },
      visibles: {
        type: 'array',
        itemType: 'string',
        returied: false,
        default: [],
      },
    })
    const { title, content, images, visibles } = ctx.request.body
    const { id } = ctx.state.user
    const result = await Moment.create({
      user: id,
      title,
      content,
      images,
      visibles,
      published_date: new Date(),
    })
    if (!result) {
      throw Boom.badData('创建圈子失败')
    }
    this.success({ ok: 1, message: '创建圈子成功' }, '圈子创建成功')
  }

  /**
   * @summary 获取圈子列表
   * @description
   * @router get /moment/list
   * @response 200 responseBody 返回值
   */
  public async list() {
    const { ctx } = this
    const { per_page, skip } = ctx.state
    const { id } = ctx.state.user
    const result = await Moment.find({
      deleted: false,
      $or: [{ visibles: [] }, { visibles: { $in: [id] } }],
    })
      .sort({ createdAt: -1 })
      .populate('user')
      .limit(per_page)
      .skip(skip)
      .lean()
    const res = await Promise.all(
      map(result, async (moment) => {
        const thumbUpCount =
          (await MomentThumbup.count({
            status: true,
            moment: moment._id,
          })) ?? 0
        // 查看是否点赞
        const res = await MomentThumbup.findOne({
          moment: moment._id,
          user: id,
          status: true,
        })
        let isThumbUp = true
        if (!res) {
          isThumbUp = false
        }
        return {
          ...moment,
          isThumbUp,
          thumbUpCount,
        }
      })
    )
    this.success(res)
  }

  /**
   * @summary 获取圈子详情
   * @description
   * @router get /moment/:_id
   * @request params id *_id 圈子id
   * @response 200 responseBody 返回值
   */
  public async getMomentById() {
    const { ctx } = this
    ctx.validate(
      {
        _id: { type: 'string', required: true },
      },
      ctx.params
    )
    const { _id } = ctx.params
    const res = await Moment.findById(_id).populate('user').lean()
    if (!res) {
      throw Boom.badData('圈子可能不存在， 请确认后重新获取')
    }
    this.success({ moment: res }, '获取圈子详情成功')
  }

  /**
   * @summary 收藏圈子
   * @description
   * @router put /moment/favourite
   * @request formData id *moment 圈子id
   * @request formData bool status 是否收藏
   * @response 200 responseBody 返回值
   */
  public async favouriteMoment() {
    const { ctx } = this
    ctx.validate({
      moment: { type: 'string', required: true },
      status: { type: 'bool', required: false, default: true },
    })
    const { moment, status } = ctx.request.body
    const { id } = ctx.state.user
    await MomentFavourite.findOneAndUpdate(
      { moment, user: id },
      {
        $setOnInsert: {
          moment,
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
      const momentObj = await Moment.findById(moment)
      if (user && momentObj) {
        await Notification.create({
          type: 'fav',
          recipientID: momentObj.user,
          description: `${user.nickname}收藏了您的圈子 《${momentObj.title}》`,
        })
      }
    } catch (err) {
      console.log(err)
    }

    const message = status ? '已收藏该圈子' : '已取消收藏该圈子'
    this.success({ isFavourite: status }, message)
  }

  /**
   * @summary 点赞圈子
   * @description
   * @router put /moment/thumbup
   * @request formData id *moment 圈子id
   * @request formData bool status 是否点赞
   * @response 200 responseBody 返回值
   */
  public async thumbupMoment() {
    const { ctx } = this
    ctx.validate({
      moment: { type: 'string', required: true },
      status: { type: 'bool', required: false, default: true },
    })
    const { moment, status } = ctx.request.body
    const { id } = ctx.state.user

    await MomentThumbup.findOneAndUpdate(
      { moment, user: id },
      {
        $setOnInsert: {
          moment,
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
      const momentObj = await Moment.findById(moment)
      if (user && momentObj) {
        await Notification.create({
          type: 'up',
          recipientID: momentObj.user,
          description: `${user.nickname}点赞了您的圈子 《${momentObj.title}》`,
        })
      }
    } catch (err) {
      console.log(err)
    }
    const message = status ? '已点赞该圈子' : '已取消点赞该圈子'
    this.success({ isThumbup: status }, message)
  }

  /**
   * @summary 是否点赞圈子
   * @description
   * @router get /moment/thumbup/:_id
   * @request params id *_id 圈子id
   * @response 200 responseBody 返回值
   */
  public async isThumbupMoment() {
    const { ctx } = this
    ctx.validate(
      {
        _id: { type: 'string', required: true },
      },
      ctx.params
    )
    const { _id: momentId } = ctx.params
    const { id: userId } = ctx.state.user
    try {
      const res = await MomentThumbup.findOne({
        moment: momentId,
        user: userId,
        status: true,
      })
      if (!res) {
        this.success({ isThumbup: false }, '该圈子未点赞')
      } else {
        this.success({ isThumbup: true }, '该圈子已点赞')
      }
    } catch (err) {
      throw Boom.badData('用户或圈子可能不存在，请稍后再试')
    }
  }

  /**
   * @summary 是否收藏圈子
   * @description
   * @router get /moment/favourite/:_id
   * @request params id *_id 圈子id
   * @response 200 responseBody 返回值
   */
  public async isFavouriteMoment() {
    const { ctx } = this
    ctx.validate(
      {
        _id: { type: 'string', required: true },
      },
      ctx.params
    )
    const { _id: momentId } = ctx.params
    const { id: userId } = ctx.state.user
    try {
      const res = await MomentFavourite.findOne({
        moment: momentId,
        user: userId,
        status: true,
      })
      if (!res) {
        this.success({ isFavourite: false }, '该圈子未收藏')
      } else {
        this.success({ isFavourite: true }, '该圈子已收藏')
      }
    } catch (err) {
      throw Boom.badData('用户或圈子可能不存在，请稍后再试')
    }
  }

  /**
   * @summary 更新圈子
   * @description
   * @router put /moment/update
   * @request formData moment *moment 圈子id
   * @request formData string title 标题
   * @request formData string content 圈子内容
   * @request formData string images 圈子图片
   * @request formData string visibles 可见权限
   * @response 200 responseBody 返回值
   */
  public async update() {
    const { ctx } = this
    ctx.validate({
      moment: { type: 'string', required: true },
      title: { type: 'string', required: false },
      content: { type: 'string', required: false },
      images: { type: 'array', itemType: 'string', required: false },
      visibles: {
        type: 'array',
        itemType: 'string',
        required: false,
      },
    })
    const { moment, title, content, images, visibles } = ctx.request.body

    const params = pickBy(
      {
        title,
        content,
        images,
        visibles,
      },
      identity
    )

    const result = await Moment.findByIdAndUpdate(moment, params)
    if (!result) {
      throw Boom.badData('圈子更新失败')
    }
    this.success({ ok: 1, message: '圈子更新成功' }, '圈子更新成功')
  }
  /**
   * @summary 删除圈子
   * @description
   * @router delete /moment/delete
   * @request formData moment *moment 圈子id
   * @response 200 responseBody 返回值
   */
  public async delete() {
    const { ctx } = this
    ctx.validate({
      moment: { type: 'string', required: true },
    })
    const { moment } = ctx.request.body

    const result = await Moment.findByIdAndUpdate(moment, { deleted: true })
    if (!result) {
      throw Boom.badData('圈子删除失败')
    }
    this.success({ ok: 1, message: '圈子删除成功' }, '圈子删除成功')
  }
}
