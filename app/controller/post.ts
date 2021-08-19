import Post from '../model/post'
import BaseController from './base_controller'

/**
 * @controller PostController
 */

export default class PostController extends BaseController {
  /**
   * @summary 获取文章列表
   * @description
   * @router get /
   * @request query integer field_name desc
   */
  public async list() {
    const { ctx } = this
    const { per_page, skip } = ctx.state
    console.log('test:', per_page, skip)
    const result = await Post.find().limit(per_page).skip(skip).lean()
    this.success(result)
  }
}
