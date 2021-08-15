import { prop, Ref, getModelForClass } from '@typegoose/typegoose'
import BaseModel from './base_model'
import { Post } from './post'

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
    @prop({ select: false, minlength: 6, maxlength: 20, required: true, })
    public password: string

    // 用户昵称
    @prop({ minlength: 4, maxlength: 32, trim: true })
    public nickname?: string

    // 用户邮箱
    @prop({ select: false })
    public email?: string

    // 粉丝  默认 type 为 ObjectId
    @prop({ ref: 'User', default: [] })
    public followers?: Ref<User>[]

    // // // 收藏的文章
    @prop({ ref: 'Post', default: [] })
    public favourites?: Ref<Post>[]

    // 头像
    @prop()
    public avatar?: string

    // 性别  0：女 1：男 
    @prop({ default: 0 })
    public sex: number

    // 是否删除
    @prop({
        select: false,
        index: true,
        default: false
    })
    public deleted?: boolean

}

export default getModelForClass(User)

