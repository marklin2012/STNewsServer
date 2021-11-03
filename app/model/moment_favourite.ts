import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { Moment } from './moment'
import { User } from './user'

// 圈子收藏表
export class MomentFavourite extends BaseModel {
  // 收藏的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 被收藏的圈子
  @prop({ required: true, ref: 'Moment' })
  public moment: Ref<Moment>

  // 是否收藏的状态
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public status?: boolean
}

export default getModelForClass(MomentFavourite, mongoConfig)
