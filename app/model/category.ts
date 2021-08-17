import { prop, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'


// 分类表
export class Category extends BaseModel {
  // 类型名
  @prop()
  public name?: string

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: false
  })
  public deleted?: boolean

}

export default getModelForClass(Category)

