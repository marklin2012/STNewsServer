import User from '../model/user'
import Announcement from '../model/announcement'
import Notification from '../model/notification'
import * as Boom from '@hapi/boom'
import BaseController from './base_controller'
import { map } from 'lodash'

/**
 * @controller NotifyController
 */

export default class NotifyController extends BaseController {
  /**
  * @summary 创建公告对象
  * @description 
  * @router post /annoucement/add
  * @request formData string *title
  * @request formData string subscript
  * @request formData string content
 
  */
  public async addAnnouncement() {
    const { ctx } = this
    ctx.validate({
      title: { type: 'string', required: true },
      subscript: { type: 'string', required: false, default: '' },
      content: { type: 'string', required: false, default: '' },
    })
    const { id } = ctx.state.user
    const { title, content, subscript } = ctx.request.body
    const res = await Announcement.create({
      sender: id,
      title,
      subscript,
      content,
    })

    if (!res) {
      throw Boom.badData('创建公告消息失败')
    }
    this.success(
      {
        announcement: res,
      },
      '创建公告消息成功'
    )
  }

  /**
  * @summary 获取公告
  * @description 返回值 type 为 sys 系统消息, fav 收藏事件, up 点赞事件， comment 评论
  * @router get /notify/list

  */
  public async getUserNotify() {
    const { ctx } = this
    const { id } = ctx.state.user
    const { per_page, skip } = ctx.state

    // 1. 创建用户的公告提醒列表
    // 查看用户创建时间
    const user = await User.findById(id, { createdAt: true })
    if (!user) {
      throw Boom.badData('用户不存在， 请重新登录后重试！')
    }
    console.log('用户创建时间：', user.createdAt)
    let lastDate = user.createdAt
    // 查找最近拉取过的公告时间，
    // 如果时间不存在或者早于用户公告表创建时间，
    // 默认按 id 排序
    const lastNotification = await Notification.findOne(
      { recipientID: id },
      { createdAt: true }
    )
    console.log('用户上次拉取时间:', lastDate)
    if (lastNotification) {
      lastDate = lastNotification.createdAt
    }

    console.log('最新日期:', lastDate)
    const announcements = await Announcement.find({
      createdAt: { $gte: lastDate },
    })
    console.log('需要拉取的公告：', announcements)
    // 新建用户的消息公告
    await Promise.all(
      map(announcements, async (announcement) => {
        return await Notification.create({
          recipientID: id,
          announceID: announcement._id,
        })
      })
    )
    // 2. 拉取用户的公告

    const res = await Notification.find({ recipientID: id })
      .limit(per_page)
      .skip(skip)
      .populate({ path: 'announceID', populate: { path: 'sender' } })
      .populate('recipientID')
      .lean()

    this.success(
      {
        noti: res,
      },
      'success'
    )
  }

  /**
  * @summary 公告已读
  * @description 
  * @router put /notify/readed
  * @reuest formData string *id 消息ID
 
  */
  public async notifyReaded() {
    const { ctx } = this
    ctx.validate({
      id: { type: 'string', required: true },
    })
    const { id: notiId } = ctx.request.body

    const res = await Notification.findByIdAndUpdate(
      notiId,
      {
        $set: { isRead: true, readAt: new Date() },
      },
      { new: true }
    ).lean()

    if (!res) {
      throw Boom.badData('更新消息已读失败')
    }
    this.success(
      {
        notify: res,
      },
      '更新消息已读成功'
    )
  }
}
