import imgurPackage from 'imgur'
import { successHandler } from '../utils/responseHandler.js'
import catchAsync from '../utils/catchAsync.js'
import imgur from '../service/imgur.js'
import Image from '../model/images.js'
import AppError from '../utils/appError.js'

export default {
  // GET /upload/images
  getImages: catchAsync(async (req, res) => {
    const imageDoc = await Image.find()
    successHandler({ res, data: imageDoc })
  }),
  // POST /upload/image
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
  // POST /upload/imageToAlbum
  uploadImageToAlbum: catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError({ statusCode: 400, error: '尚未上傳檔案' }))
    }

    // const dimensions = sizeOf(req.files[0].buffer)
    // if (dimensions.width !== dimensions.height) {
    //   return next(new AppError({ statusCode: 400, error: '圖片長寬不符合 1:1 尺寸。' }))
    // }

    const client = new imgurPackage.ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    })
    const imgurRes = await client.upload({
      image: req.file.buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID,
    })

    console.log('imgurRes', imgurRes)

    const imageLink = imgurRes?.data?.link
    console.log('imgurRes', imgurRes.data.link)

    // if (!imageLink) {
    //   throw new Error('上傳圖片失敗，無法取得圖片網址')
    // }

    const imageRes = await Image.create({ url: imageLink })
    return successHandler({ res, data: imageRes })
  }),

}
