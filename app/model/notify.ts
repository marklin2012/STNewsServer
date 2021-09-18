import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { User } from './user'

// 用户公告表(消息提醒)
export class Announcement extends BaseModel {
  // 接收用户
  @prop({ required: true, ref: 'User' })
  public recipientID: Ref<User>

  // 对象
  @prop({ required: true, ref: 'Announcement' })
  public announceID: Ref<Announcement>

  // 是否已读
  @prop({ required: false, default: false })
  public state: boolean

  // 阅读时间
  @prop({ required: false })
  public readAt?: Date

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public deleted?: boolean
}

export default getModelForClass(Announcement, mongoConfig)
