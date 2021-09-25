import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import { Announcement } from './announcement'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { User } from './user'

enum NotiType {
  system = 'sys', // 系统消息
  favourite = 'fav', // 收藏事件
  thumbup = 'up', // 点赞事件
  comment = 'comment', // 评论事件
}

// 用户公告表(消息提醒)
export class Notification extends BaseModel {
  // 接收用户
  @prop({ required: true, ref: 'User' })
  public recipientID: Ref<User>

  // 对象
  @prop({ required: false, ref: 'Announcement' })
  public announceID?: Ref<Announcement>

  // 是否已读
  @prop({ required: false, default: false })
  public isRead: boolean

  // 阅读时间
  @prop({ required: false })
  public readAt?: Date

  //
  @prop({
    required: false,
    enum: ['sys', 'fav', 'up', 'comment'],
    default: 'sys',
  })
  public type?: NotiType

  //备注
  @prop({ required: false, default: '' })
  public description?: string

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public deleted?: boolean
}

export default getModelForClass(Notification, mongoConfig)
