import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { Post } from './post'
import { User } from './user'

// 文章点赞表
export class PostThumbup extends BaseModel {
  // 点赞的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 被点赞的文章
  @prop({ required: true, ref: 'Post' })
  public post: Ref<Post>

  // 是否点赞的状态
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public status?: boolean
}

export default getModelForClass(PostThumbup, mongoConfig)
