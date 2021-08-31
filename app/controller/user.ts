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
      mobile: mobile,
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
      { mobile: userInfo.mobile, password: userInfo.password },
      this.app.config.jwt.secret
    )

    this.success({ token, user: userInfo }, '登录成功')
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
        mobile: mobile,
        deleted: false,
      },
      {
        $setOnInsert: {
          mobile: mobile,
          password: '',
          nickname: defaultNickNameWithMobile(mobile),
          deleted: false,
          sex: 0,
        },
      },
      { new: true, upsert: true }
    ).lean()

    if (!userInfo) {
      throw Boom.badData('未找到对应用户')
    }

    let token = await this.app.jwt.sign(
      { mobile: userInfo.mobile, password: userInfo.password },
      this.app.config.jwt.secret
    )

    this.success({ token: token, user: userInfo }, '登录成功')
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
    let userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: { password: trim(password) } }
    )
    if (!userInfo) {
      throw Boom.badData('用户不存在')
    }
    let token = await this.app.jwt.sign(
      { mobile: userInfo.mobile, password: userInfo.password },
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
   * @summary 修改密码
   * @description
   * @router post /user/password/modify
   * @request formData string *old_password 旧密码
   * @request formData string *password 密码
   * @request formData string *re_password 验证密码
   * @response 200 responseBody 返回值
   */
  public async changePassword() {
    let { ctx } = this
    ctx.validate({
      old_password: { type: 'string', required: true },
      password: { type: 'string', required: true },
      re_password: { type: 'string', required: true },
    })

    let {
      old_password: oldPassowrd,
      password,
      re_password: rePassword,
    } = ctx.request.body
    let { mobile } = ctx.state.user

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

  public async modify() {
    let { ctx } = this
    let { sex, nickname } = ctx.request.body
    let { mobile } = ctx.state.user
    var modify = {}
    if (sex) {
      modify['sex'] = sex
    }
    if (nickname) {
      modify['nickname'] = nickname
    }
    let userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: modify }
    )
    if (!userInfo) {
      ctx.body = { code: 400, message: '手机号不存在' }
      return
    }
    ctx.body = {
      code: 200,
      message: '修改用户信息成功',
    }
  }

  public async delete() {
    let { ctx } = this
    let { mobile } = ctx.state.user
    let userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: { deleted: true } }
    )
    if (!userInfo) {
      ctx.body = { code: 400, message: '手机号不存在' }
      return
    }
    ctx.body = {
      code: 200,
      message: '用户删除成功',
    }
  }

  public async getUserInfo() {
    let { ctx } = this
    let { mobile } = ctx.state.user
    let userInfo = await User.findOneAndUpdate(
      { mobile: mobile },
      { $set: { deleted: true } }
    )
    if (!userInfo) {
      ctx.body = { code: 400, message: '手机号不存在' }
      return
    }
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: {
        userInfo: userInfo,
      },
    }
  }
}
