import { successHandler } from '../utils/responseHandler.js'
import catchAsync from '../utils/catchAsync.js'
import imgur from '../service/imgur.js'
import Image from '../model/images.js'

export default {
  // GET /upload/images
  getImages: catchAsync(async (req, res) => {
    const imageDoc = await Image.find()
    successHandler({ res, data: imageDoc })
  }),
  // POST /upload/images
  uploadImage: catchAsync(async (req, res, next) => {
    // if (!req.file) {
    //   return errorHandler({ res, statusCode: 400, error: '需要有 file' })
    // }

    const encodeImage = req.file.buffer.toString('base64')
    console.log('encoded_image', encodeImage)

    const imgurRes = await imgur.uploadImage(encodeImage)
    const imageLink = imgurRes?.data?.data?.link
    console.log('imgurRes', imgurRes.data.data.link)

    // if (!imageLink) {
    //   throw new Error('上傳圖片失敗，無法取得圖片網址')
    // }

    const imageRes = await Image.create({ url: imageLink })

    return successHandler({ res, data: imageRes })
  }),

}
