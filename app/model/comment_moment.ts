import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { Moment } from './moment'
import { User } from './user'

export class CommentMoment extends BaseModel {
  // 评论内容
  @prop({ required: true })
  public content: string

  // 发布者 默认 type 为 ObjectId
  @prop({ ref: () => Moment, required: true })
  public moment: Ref<Moment>

  // 发布者 默认 type 为 ObjectId
  @prop({ ref: 'User', required: true })
  public user: Ref<User>

  //  回复哪条评论
  @prop({ ref: 'CommentMoment', required: false })
  public comment?: Ref<CommentMoment> | null

  // 在哪条评论下回复
  @prop({ ref: 'CommentMoment', required: false })
  public reference?: Ref<CommentMoment> | null

  // 发布日期
  @prop({ required: true })
  public published_date: Date

  // 是否置顶
  @prop({ default: false })
  public is_top: boolean

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: false,
  })
  public deleted?: boolean
}

export default getModelForClass(CommentMoment, mongoConfig)
