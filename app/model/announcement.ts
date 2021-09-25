import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { User } from './user'

// 公告表(消息提醒)
export class Announcement extends BaseModel {
  // 被关注的用户
  @prop({ required: true, ref: 'User' })
  public sender: Ref<User>

  // 消息标题
  @prop({ required: true })
  public title: string

  // 消息描述
  @prop({ required: false, default: '' })
  public subscript?: string

  // 消息内容
  @prop({ required: false, default: '' })
  public content?: string

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public deleted?: boolean
}

export default getModelForClass(Announcement, mongoConfig)
