import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { User } from './user'

export class Feedback extends BaseModel {
  // 评论内容
  @prop({ required: true })
  public content: string

  // 联系方式
  @prop({ required: true })
  public contact: string

  // 头图
  @prop({ default: [] })
  public images?: string[]

  // 反馈者 默认 type 为 ObjectId
  @prop({ ref: 'User', required: true })
  public user: Ref<User>

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: false,
  })
  public deleted?: boolean
}

export default getModelForClass(Feedback, mongoConfig)
