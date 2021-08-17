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
  * @reuest query string path *id
 
  */
  public async addUserTest() {
    const { ctx } = this
    var mo = 12345678900 + Math.floor(Math.random() * 1000000)
    // 模拟前端传递过来的数据
    const user = new User()
    user.password = '123456'
    user.mobile = mo.toString()
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



