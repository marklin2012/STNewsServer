
import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { User } from './user'


// 分类表
export class UserFans extends BaseModel {
  // 被关注的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 粉丝
  @prop({ required: true, ref: 'User' })
  public follower: Ref<User>

  // 是否关注的状态
  @prop({
    select: false,
    index: true,
    default: true
  })
  public status?: boolean

}

export default getModelForClass(UserFans)

