import { Controller } from 'egg'

/**
 * @controller PostController
 */

export default class PostController extends Controller {

  public async list() {
    const { ctx } = this

    ctx.body = {
      code: 0,
      message: '',
      data: {
        result: 'post'
      }
    }
  }

}



