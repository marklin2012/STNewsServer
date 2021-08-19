import { Controller } from 'egg'

export default class BaseController extends Controller {
  success(data) {
    this.ctx.body = {
      statusCode: 200,
      message: 'success',
      data,
    }
  }
}
