import { Controller } from 'egg';
import User from '../model/user';



export default class UserController extends Controller {
  /**
  * @summary 示例
  * @description 展示示例代码

  */

  public async addUserTest() {
    const { ctx } = this;

    // 模拟前端传递过来的数据
    const user = new User()
    user.password = '123456'
    user.mobile = '12345678911'
    user.nickname = 'nickname'

    const res = await User.create(user)
    ctx.body = res
  }
}



