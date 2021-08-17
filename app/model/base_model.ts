// import { Types } from 'mongoose'
import { prop } from '@typegoose/typegoose'

export default class BaseModel {
  @prop({ index: true, auto: true })
  public created: Date
  @prop({ auto: true })
  public updatedAt: Date
}
