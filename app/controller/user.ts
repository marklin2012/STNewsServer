import { Controller } from 'egg'

import User from '../model/user'

/**
 * @controller UserController
 */

export default class UserController extends Controller {

  public async loginWithPassword() {
    let { ctx } = this;
    let { mobile, password } = ctx.request.body;

    //这里添加参数校验
    if (!mobile || !password || mobile.length == 0 || password.length == 0) {
      ctx.body = { code: 400, message: '参数错误' };
      return;
    }

    let userInfo = await User.findOne({ mobile: mobile }, { mobile: 1, password: 1 });
    if (!userInfo || (userInfo && userInfo.deleted == true)) {
      ctx.body = { code: 400, message: '手机号不存在' };
      return;
    }

    if (userInfo.password == "") {
      ctx.body = { code: 400, message: '请用验证码登录并设置密码' };
      return;
    }

    if (userInfo.password != password) {
      ctx.body = { code: 400, message: '密码不正确' };
      return;
    }

    let userInfoArr = JSON.parse(JSON.stringify({
      mobile: mobile,
      password: password,
    }));
    let token = await this.app.jwt.sign(userInfoArr, this.app.config.jwt.secret);

    ctx.body = {
      code: 200, message: '登录成功', data: {
        token: token
      }
    };
  }

  public async loginWithPin() {
    let { ctx } = this;
    let { mobile, pin } = ctx.request.body;

    //这里添加参数校验
    if (!mobile || !pin || mobile.length == 0 || pin.length == 0) {
      ctx.body = { code: 400, message: '参数错误' };
      return;
    }

    //暂时使用
    if (pin != '000000') {
      ctx.body = { code: 400, message: '验证码不正确' };
      return;
    }

    let userInfo = await User.findOne({ mobile: mobile }, { mobile: 1, deleted: 1 });
    if (!userInfo || (userInfo && userInfo.deleted == true)) {
      if (userInfo && userInfo.deleted == true) {
        await User.findOneAndDelete({ mobile: mobile });
      }
      userInfo = await User.create({ mobile: mobile, password: "", deleted: false });
    }

    let userInfoArr = JSON.parse(JSON.stringify({
      mobile: mobile,
      password: ""
    }));
    let token = await this.app.jwt.sign(userInfoArr, this.app.config.jwt.secret);

    ctx.body = {
      code: 200, message: '登录成功', data: {
        token: token,
      }
    };
  }

  public async changePassword() {
    let { ctx } = this;
    let { password } = ctx.request.body;
    let { mobile } = ctx.state.user;
    let userInfo = await User.findOneAndUpdate({ mobile: mobile }, { $set: { password: password } });
    if (!userInfo) {
      ctx.body = { code: 400, message: '手机号不存在' };
      return;
    }

    let userInfoArr = JSON.parse(JSON.stringify({
      mobile: mobile,
      password: password,
    }));
    let token = await this.app.jwt.sign(userInfoArr, this.app.config.jwt.secret);

    ctx.body = {
      code: 200, message: '修改密码成功', data: {
        token: token
      }
    };
  }

  public modify() {

  }

  public async delete() {
    let { ctx } = this;
    let { mobile } = ctx.state.user;
    let userInfo = await User.findOneAndUpdate({ mobile: mobile }, { $set: { deleted: true } });
    if (!userInfo) {
      ctx.body = { code: 400, message: '手机号不存在' };
      return;
    }
    ctx.body = {
      code: 200, message: '用户删除成功'
    };
  }
}


