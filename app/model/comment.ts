import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { Post } from './post'
import { User } from './user'


export class Comment extends BaseModel {
  // 原始链接
  @prop()
  public original_link?: string

  // 评论内容
  @prop({ required: true })
  public content: string

  // 发布者 默认 type 为 ObjectId
  @prop({ ref: () => Post, required: true })
  public post: Ref<Post>

  // 发布者 默认 type 为 ObjectId
  @prop({ ref: 'User', required: true })
  public user: Ref<User>

  // 发布日期
  @prop({ required: true })
  public published_date: string

  // 点赞的用户 默认 type 为 ObjectId
  @prop({ ref: 'User', default: [] })
  public favourites?: Ref<User>[]

  // 是否置顶
  @prop()
  public is_top: boolean

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: false
  })
  public deleted?: boolean

}

export default getModelForClass(Comment)

