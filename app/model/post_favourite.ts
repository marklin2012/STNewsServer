import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { Post } from './post'
import { User } from './user'

// 分类表
export class PostFavourite extends BaseModel {
  // 点点赞的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 被点赞的文章
  @prop({ required: true, ref: 'Post' })
  public post: Ref<Post>

  // 是否关注的状态
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public status?: boolean
}

export default getModelForClass(PostFavourite)
