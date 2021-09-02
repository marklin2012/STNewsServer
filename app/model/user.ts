import { prop, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'

export class User extends BaseModel {
  @prop({
    index: true,
    unique: true,
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 20,
  })
  public mobile: string

  // 密码
  @prop({ select: false })
  public password: string

  // 用户昵称
  @prop({ minlength: 4, maxlength: 32, trim: true })
  public nickname?: string

  // 用户邮箱
  @prop({ select: false })
  public email?: string

  // 头像
  @prop()
  public avatar?: string

  // 性别 0:未知 1:男 2:女
  @prop({ default: 0 })
  public sex: number

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: false,
  })
  public deleted?: boolean
}

export default getModelForClass(User)
