import BaseController from './base_controller'
import * as Boom from '@hapi/boom'
import Feedback from '../model/feedback'

/**
 * @controller FeedbackController
 */
export default class FileUpload extends BaseController {
  /**
   * @summary 上传反馈接口
   * @description 先通过上传文件获取图片地址
   * @router post /feedback
   * @response 200 responseBody 返回值
   */
  public async feedback() {
    const { ctx } = this
    const { id } = ctx.state.user
    ctx.validate({
      content: { type: 'string', required: true },
      contact: { type: 'string', required: true },
      images: {
        required: false,
        default: [],
        type: 'array',
        itemType: 'string',
      },
    })
    const { content, contact, images } = ctx.request.body
    const res = await Feedback.create({
      content,
      contact,
      images,
      user: id,
    })
    if (!res) {
      throw Boom.badData('创建反馈失败')
    }
    this.success({ ok: 1 }, '上传反馈成功')
  }
}
