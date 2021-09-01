import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { User } from './user'

// 分类表
export class UserFavourite extends BaseModel {
  // 点关注的用户
  @prop({ index: true, required: true, ref: 'User' })
  public user: Ref<User>

  // 被关注的用户
  @prop({ index: true, required: true, ref: 'User' })
  public followed_user: Ref<User>

  // 是否关注的状态
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public status?: boolean
}

export default getModelForClass(UserFavourite)
