import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { Category } from './category'
import { User } from './user'

export class Post extends BaseModel {
  // 分类
  @prop({ ref: 'Category' })
  public categories?: Ref<Category>[]

  // 原始链接
  @prop()
  public original_link?: string

  // 标题
  @prop({ required: true })
  public title: string

  // 文章内容 暂时用 h5
  @prop({ required: true })
  public article: string

  // 作者 默认 type 为 ObjectId
  @prop({ ref: 'User', required: true })
  public author: Ref<User>

  // 发布日期
  @prop({ required: true })
  public published_date: Date

  // 是否置顶
  @prop({ default: false })
  public is_top: boolean

  // 封面图片地址
  @prop()
  public cover_image?: string

  // 头图
  @prop({ default: [] })
  public head_images?: string[]

  // 是否删除
  @prop({
    select: false,
    index: true,
    default: false,
  })
  public deleted?: boolean
}

export default getModelForClass(Post)
