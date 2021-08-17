import { Controller } from 'egg'

/**
 * @controller HomeController
 */
export default class HomeController extends Controller {
  /**
   * @router get /  路径
   * @summary 接口的小标题信息
   * @description 接口的描述信息
   */

  public async index() {
    const { ctx } = this
    // ctx.body = await ctx.service.test.sayHi('egg');
    ctx.body = {
      code: 0,
      message: '',
      data: {
        result: 'test',
      },
    }
  }
}
