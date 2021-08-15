import { Controller } from 'egg';

export default class HomeController extends Controller {
  /**
  * @summary 示例
  * @description 展示示例代码

  */

  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }


}



