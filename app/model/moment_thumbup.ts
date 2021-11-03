import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { mongoConfig } from './config'
import { Moment } from './moment'
import { User } from './user'

// 圈子点赞表
export class MomentThumbup extends BaseModel {
  // 点赞的用户
  @prop({ required: true, ref: 'User' })
  public user: Ref<User>

  // 被点赞的圈子
  @prop({ required: true, ref: 'Moment' })
  public moment: Ref<Moment>

  // 是否点赞的状态
  @prop({
    select: false,
    index: true,
    default: true,
  })
  public status?: boolean
}

export default getModelForClass(MomentThumbup, mongoConfig)
