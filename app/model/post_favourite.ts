import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { Post } from './post'
import { User } from './user'

// 文章收藏表
export class PostFavourite extends BaseModel {
  // 点收藏的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 被收藏的文章
  @prop({ required: true, ref: 'Post' })
  public post: Ref<Post>

  // 是否收藏的状态
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public status?: boolean
}

export default getModelForClass(PostFavourite, mongoConfig)
