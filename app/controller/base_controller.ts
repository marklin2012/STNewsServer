import { Controller } from 'egg'

export default class BaseController extends Controller {
  success(data, message?) {
    this.ctx.body = {
      statusCode: 200,
      message: message ?? 'success',
      data,
    }
  }
}
