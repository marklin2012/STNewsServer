import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { User } from './user'

export class Moment extends BaseModel {
  // 标题
  @prop({ required: true })
  public title: string

  // 内容   字数限制 100
  @prop({ required: true, maxlength: 100 })
  public content: string

  // 发布者 默认 type 为 ObjectId
  @prop({ ref: 'User', required: true })
  public user: Ref<User>

  // 图片
  @prop({ default: [] })
  public images?: string[]

  // 仅谁可见 当数组为空时，对所有人可见,
  @prop({ default: [] })
  public visibles?: string[]

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: false,
  })
  public deleted?: boolean
}

export default getModelForClass(Moment, mongoConfig)
