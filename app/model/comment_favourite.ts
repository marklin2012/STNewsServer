import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { User } from './user'
import { Comment } from './comment'


// 分类表
export class CommentFavourite extends BaseModel {
  // 点点赞的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 被点赞的评论
  @prop({ required: true, ref: 'Comment' })
  public comment: Ref<Comment>

  // 是否关注的状态
  @prop({
    select: false,
    index: true,
    default: true
  })
  public status?: boolean

}

export default getModelForClass(CommentFavourite)

