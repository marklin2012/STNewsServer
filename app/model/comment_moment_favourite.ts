import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { User } from './user'
import { mongoConfig } from './config'
import { CommentMoment } from './comment_moment'

// 分类表
export class CommentMomentFavourite extends BaseModel {
  // 点点赞的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 被点赞的评论
  @prop({ required: true, ref: 'CommentMoment' })
  public comment: Ref<CommentMoment>

  // 是否关注的状态
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public status?: boolean
}

export default getModelForClass(CommentMomentFavourite, mongoConfig)
