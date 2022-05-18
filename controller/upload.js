import { successHandler, errorHandler } from '../utils/responseHandler.js'
import imgur from '../service/imgur.js'
import Image from '../model/images.js'

export default {
  async getImages(req, res) {
    try {
      const imageDoc = await Image.find()
      successHandler({ res, data: imageDoc })
    } catch (error) {
      errorHandler({ res, statusCode: 400, error: error.message })
    }
  },
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return errorHandler({ res, statusCode: 400, error: '需要有 file' })
      }

      const encodeImage = req.file.buffer.toString('base64')
      console.log('encoded_image', encodeImage)

      const imgurRes = await imgur.uploadImage(encodeImage)
      const imageLink = imgurRes?.data?.data?.link
      console.log('imgurRes', imgurRes.data.data.link)
      if (!imageLink) {
        throw new Error('上傳圖片失敗，無法取得圖片網址')
      }

      const imageRes = await Image.create({ url: imageLink })

      return successHandler({ res, data: imageRes })
    } catch (error) {
      return errorHandler({ res, statusCode: 400, error: error.message })
    }
  },
  // async uploadImages(req, res) {
  //   try {
  //     const encodeImage = req.file.buffer.toString('base64')
  //     console.log('encoded_image', encodeImage)
  //     successHandler({ res, data: 'hello world' })
  //   } catch (error) {
  //     errorHandler({ res, statusCode: 400, error: error.message })
  //   }
  // },
}
