import User from '../model/user'
import BaseController from './base_controller'
import * as Boom from '@hapi/boom'
import { trim } from 'lodash'
import { defaultNickNameWithMobile } from '../utils/nickname'

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
    let { ctx } = this

    ctx.validate({
      mobile: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    let { mobile, password } = ctx.request.body

    let userInfo = await User.findOne({
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

    let token = await this.app.jwt.sign(
      { mobile: userInfo.mobile },
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

    let token = await this.app.jwt.sign(
      { mobile: userInfo.mobile },
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
    if (trim(password) == trim(rePassword)) {
      throw Boom.badData('两次输入密码不一致')
    }
    const userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: { password: trim(password) } }
    )
    if (!userInfo) {
      throw Boom.badData('用户不存在')
    }
    const token = await this.app.jwt.sign(
      { mobile: userInfo.mobile },
      this.app.config.jwt.secret
    )
    this.success({ token }, '修改密码成功')
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

    let userInfo = await User.findOneAndUpdate(
      { mobile: mobile, password: oldPassowrd, deleted: false },
      { $set: { password: trim(password) } }
    )
    if (!userInfo) {
      throw Boom.badData('用户不存在或旧密码错误')
    }

    let token = await this.app.jwt.sign(
      { mobile: userInfo.mobile, password: userInfo.password },
      this.app.config.jwt.secret
    )

    this.success({ token }, '修改密码成功')
  }

  /**
   * @summary 修改用户资料
   * @description
   * @router put /user/update
   * @request formData string sex 性别
   * @request formData string nickname 昵称
   * @request formData string head_image 头像地址
   * @response 200 responseBody 返回值
   */
  public async update() {
    let { ctx } = this
    ctx.validate({
      sex: { type: 'number' },
      nickname: { type: 'string', min: 3, max: 20 },
      head_image: { type: 'string' },
    })
    // let { sex, nickname, head_image } = ctx.request.body
    let { mobile } = ctx.state.user

    let userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: ctx.request.body }
    ).lean()
    if (!userInfo) {
      throw Boom.badData('用户不存在')
    }
    this.success({ user: userInfo }, '修改用户信息成功')
  }

  /**
   * @summary 修改用户资料
   * @description
   * @router get /user/info
   * @response 200 responseBody 返回值
   */
  public async getUserInfo() {
    let { ctx } = this
    let { mobile } = ctx.state.user
    console.log('mobile:', mobile)
    let userInfo = await User.findOne({ mobile: mobile }).lean()
    if (!userInfo) {
      throw Boom.badData('用户不存在')
    }
    this.success({ user: userInfo }, '获取用户信息成功')
  }
}
