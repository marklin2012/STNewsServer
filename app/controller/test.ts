import { Controller } from 'egg';
import User from '../model/user';

/**
 * @controller TestController
 */

export default class TestController extends Controller {

  /**
  * @summary 用户测试
  * @description 
  * @router get /test/add_user
  * @reuest path string *id
  */
  public async addUserTest() {
    const { ctx } = this;

    // 模拟前端传递过来的数据
    const user = new User()
    user.password = '123456'
    user.mobile = '12345678911'
    user.nickname = 'nickname'
    const res = await User.create(user)
    ctx.body = {
      code: 0,
      message: '',
      data: {
        result: res
      }
    }
  }
}



