import BaseController from './base_controller'
import * as path from 'path'
import * as fs from 'fs'
import { getRandom } from '../utils/random'
import * as Boom from '@hapi/boom'

/**
 * @controller FileController
 */
export default class FileUpload extends BaseController {
  /**
   * @summary 上传图片接口
   * @description content-type: multipart/form-data, 返回 imgUrl， 需要拼接 host 地址, 测试地址: http://127.0.0.1:7001/
   * @router post /file/upload
   * @response 200 responseBody 返回值
   */
  public async uploadFile() {
    const { ctx } = this
    const files = ctx.request.files

    let ext = ''
    if (files[0].mime === 'image/png') {
      ext = 'png'
    } else if (files[0].mime === 'image/jpeg') {
      ext = 'jpg'
    } else if (files[0].mime === 'image/jpg') {
      ext = 'jpg'
    } else {
      throw Boom.badData('暂时仅支持 jpg 和 png 格式图片')
    }
    const file = fs.readFileSync(files[0].filepath)
    const fileName = (new Date().getTime() + getRandom(8)).toString()
    const documentPath = path.join(this.config.baseDir, 'app/public/upload')
    if (!fs.existsSync(documentPath)) {
      // console.log('没有文件夹, 成功创建文件夹')
      fs.mkdirSync(documentPath)
    }
    // 目前保存方法为临时状态，
    // ！！！更新代码后可能原来图片会消失被覆盖
    // TODO: 后续换成图片服务器，
    fs.writeFileSync(
      path.join(this.config.baseDir, `app/public/upload`, `${fileName}.${ext}`),
      file
    )
    const imgUrl = `public/upload/${fileName}.${ext}`

    this.success({ imgUrl }, 'success')
  }
}
