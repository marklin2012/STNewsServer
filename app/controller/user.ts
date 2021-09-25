import User from '../model/user'
import BaseController from './base_controller'
import * as Boom from '@hapi/boom'
import { map, trim } from 'lodash'
import { defaultNickNameWithMobile } from '../utils/nickname'
import { signUser } from '../utils/sign_jwt'
import UserFavourite from '../model/user_favourite'
import UserFans from '../model/user_fans'
import PostFavourite from '../model/post_favourite'
import Post from '../model/post'
/**
 * @controller UserController
 */

export default class UserController extends BaseController {
  /**
   * @summary 通过手机号密码登录
   * @description
   * @router post /login/password
   * @request formData string *mobile 手机号
   * @request formData string *password 密码
   * @response 200 responseBody 返回值
   */
  public async loginWithPassword() {
    const { ctx } = this

    ctx.validate({
      mobile: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const { mobile, password } = ctx.request.body

    const userInfo = await User.findOne({
      mobile: trim(mobile),
      deleted: false,
      password,
    })
    if (!userInfo) {
      throw Boom.unauthorized('手机号对应用户不存在，或密码不正确')
    }

    if (userInfo.password == '') {
      throw Boom.badData('用户密码不存在，请用验证码登录并设置密码')
    }

    const token = await signUser(
      this.app.jwt,
      userInfo,
      this.app.config.jwt.secret
    )
    const user = await userInfo.toJSON()
    this.success({ token, user: user }, '登录成功')
  }

  /**
   * @summary 验证码登录接口
   * @description
   * @router post /login/pin
   * @request formData string *mobile 手机号
   * @request formData string pin 验证码
   * @response 200 responseBody 返回值
   */
  public async loginWithPin() {
    const { ctx } = this

    ctx.validate({
      mobile: { type: 'string', required: true },
      pin: { type: 'string', required: false, default: '000000' },
    })

    const { mobile, pin } = ctx.request.body

    //暂时使用
    if (pin != '000000') {
      throw Boom.badData('验证码不正确')
    }

    const userInfo = await User.findOneAndUpdate(
      {
        mobile: trim(mobile),
        deleted: false,
      },
      {
        $setOnInsert: {
          mobile: trim(mobile),
          password: '',
          nickname: defaultNickNameWithMobile(mobile),
          deleted: false,
          sex: 0,
        },
      },
      { new: true, upsert: true }
    )

    if (!userInfo) {
      throw Boom.badData('未找到对应用户')
    }

    const token = await signUser(
      this.app.jwt,
      userInfo,
      this.app.config.jwt.secret
    )
    const user = await userInfo.toJSON()
    this.success({ token: token, user }, '登录成功')
  }

  /**
   * @summary 设置密码
   * @description
   * @router post /user/password
   * @request formData string *password 密码
   * @request formData string *re_password 验证密码
   * @response 200 responseBody 返回值
   */
  public async setPassword() {
    const { ctx } = this

    ctx.validate({
      password: { type: 'string', required: true },
      re_password: { type: 'string', required: true },
    })

    const { password, re_password: rePassword } = ctx.request.body
    const { mobile } = ctx.state.user
    if (trim(password) != trim(rePassword)) {
      throw Boom.badData('两次输入密码不一致')
    }
    const userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: { password: trim(password) } }
    )
    if (!userInfo) {
      throw Boom.badData('用户不存在')
    }

    this.success('成功修改密码', '成功修改密码')
  }

  /**
   * @summary 获取验证码
   * @description
   * @router get /checkcode
   * @request formData string *mobile 手机号
   * @response 200 responseBody 返回值
   */
  public async getCheckCode() {
    const { ctx } = this
    ctx.validate({
      mobile: { type: 'string', required: true },
    })
    const { mobile } = ctx.request.query

    this.success({ mobile, code: '000000' }, '成功发送验证码')
  }

  /**
   * @summary 验证验证码
   * @description
   * @router post /checkcode/verify
   * @request formData string *code 验证码
   * @response 200 responseBody 返回值
   */
  public async checkCheckcode() {
    const { ctx } = this
    ctx.validate({
      code: { type: 'string', required: true },
    })
    const { code } = ctx.request.body
    if (code == '000000') {
      this.success('验证码通过', '验证码通过')
    } else {
      throw Boom.badData('验证码验证失败')
    }
  }

  /**
   * @summary 修改密码 （暂时停用）
   * @description
   * @router post /user/password/modify
   * @request formData string *old_password 旧密码
   * @request formData string *password 密码
   * @request formData string *re_password 验证密码
   * @response 200 responseBody 返回值
   */
  public async changePassword() {
    const { ctx } = this
    ctx.validate({
      old_password: { type: 'string', required: true },
      password: { type: 'string', required: true },
      re_password: { type: 'string', required: true },
    })

    const {
      old_password: oldPassowrd,
      password,
      re_password: rePassword,
    } = ctx.request.body
    const { mobile } = ctx.state.user

    if (trim(rePassword) != trim(password)) {
      throw Boom.badData('两次输入密码不一致')
    }

    const userInfo = await User.findOneAndUpdate(
      { mobile: mobile, password: oldPassowrd, deleted: false },
      { $set: { password: trim(password) } }
    )
    if (!userInfo) {
      throw Boom.badData('用户不存在或旧密码错误')
    }

    const token = await this.app.jwt.sign(
      { mobile: userInfo.mobile, password: userInfo.password },
      this.app.config.jwt.secret
    )

    this.success({ token }, '修改密码成功')
  }

  /**
   * @summary 修改用户资料
   * @description
   * @router put /user/update
   * @request formData number sex 性别
   * @request formData string nickname 昵称
   * @request formData string avatar 头像地址
   * @response 200 responseBody 返回值
   */
  public async update() {
    const { ctx } = this
    ctx.validate({
      sex: { type: 'number', required: false },
      nickname: { type: 'string', min: 3, max: 20, required: false },
      avatar: { type: 'string', required: false },
    })
    // const { sex, nickname, head_image } = ctx.request.body
    const { mobile } = ctx.state.user

    const userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: ctx.request.body },
      { new: true }
    ).lean()
    if (!userInfo) {
      throw Boom.badData('用户不存在')
    }
    this.success({ user: userInfo }, '修改用户信息成功')
  }

  /**
   * @summary 获取用户资料
   * @description
   * @router get /user/info
   * @request query string *user 用户id
   * @response 200 responseBody 返回值
   */
  public async getUserInfo() {
    const { ctx } = this
    ctx.validate(
      {
        user: { type: 'string', required: true },
      },
      ctx.query
    )
    const { user } = ctx.query
    const userInfo = await User.findById(user).lean()
    if (!userInfo) {
      throw Boom.badData('用户不存在')
    }
    // 关注用户数
    const followerCount =
      (await UserFavourite.count({ user, status: false })) ?? 0
    // 粉丝数
    const fansCount =
      (await UserFans.count({ follower: user, status: false })) ?? 0
    // 最近发布文章
    const posts =
      (await Post.find({ author: user, deleted: false })
        .limit(10)
        .populate('author')
        .lean()) ?? []
    this.success(
      {
        user: userInfo,
        followerCount: followerCount,
        fansCount: fansCount,
        post: posts,
      },
      '获取用户信息成功'
    )
  }
  /**
   * @summary 关注用户
   * @description 为了扩展方便，添加关注的同时也添加被关注用户的粉丝表, 主要是为了后续分表方便
   * @router put /user/favourite
   * @request formData string *followed_user 被关注的用户id
   * @request formData string status 是否关注, 默认 true, 传 false 则取消关注
   * @response 200 responseBody 返回值
   */
  public async favouriteUser() {
    const { ctx } = this
    const { id } = ctx.state.user
    ctx.validate({
      followed_user: { type: 'string', required: true },
      status: { type: 'bool', default: true, required: false },
    })
    const { followed_user, status } = ctx.request.body

    // 为了扩展方便，添加关注的同时也添加被关注用户的粉丝表, 主要是为了后续分表方便
    try {
      await UserFavourite.findOneAndUpdate(
        {
          user: id,
          followed_user,
        },
        {
          $setOnInsert: {
            user: id,
            followed_user,
          },
          $set: {
            status,
          },
        },
        { upsert: true, new: true }
      )

      await UserFans.findOneAndUpdate(
        {
          user: followed_user,
          follower: id,
        },
        {
          $setOnInsert: {
            user: followed_user,
            follower: id,
          },
          $set: {
            status,
          },
        },
        { upsert: true, new: true }
      )
      const message = status ? '已关注用户' : '已取消关注用户'
      this.success('操作成功', message)
    } catch (err) {
      throw Boom.badData('用户可能不存在，请稍后再试')
    }
  }

  /**
   * @summary 获取自己关注的用户
   * @description
   * @router get /user/favourite/list
   * @response 200 responseBody 返回值
   */
  public async geFavouriteUsers() {
    const { ctx } = this
    const { per_page, skip } = ctx.state
    const { id } = ctx.state.user
    const res = await UserFavourite.find(
      {
        user: id,
        status: true,
      },
      { followed_user: 1 }
    )
      .limit(per_page)
      .skip(skip)
      .populate('followed_user')
      .lean()
    const users = map(res, (item) => item.followed_user)
    this.success(
      {
        favourites: users,
      },
      '成功获取关注列表'
    )
  }

  /**
   * @summary 获取自己关注的文章
   * @description
   * @router get /user/favourite/post
   * @response 200 responseBody 返回值
   */
  public async getFavouritePosts() {
    const { ctx } = this
    const { per_page, skip } = ctx.state
    const { id } = ctx.state.user
    const res = await PostFavourite.find(
      {
        user: id,
        status: true,
      },
      { post: 1 }
    )
      .limit(per_page)
      .skip(skip)
      .populate('post')
      .lean()

    const posts = map(res, (item) => item.post)
    this.success(
      {
        favourites: posts,
      },
      '成功获取收藏列表文章'
    )
  }
}
