import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// API
export const uploadApiUrl = 'https://api.imgur.com/3/upload'

// 上傳圖片，設定格式
export const uploadModule = multer({
  // 限制檔案需 2 MB內
  limit: {
    fileSize: 2 * 1024 * 1024,
  },
  // 只接受三種圖片格式
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。')
    }
    cb(null, true)

    // if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //   cb(new Error('僅接受 jpg, jpeg, png 格式'))
    // }
    // cb(null, true)
  },
})

const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('type', 'base64')

  return axios({
    method: 'POST',
    url: uploadApiUrl,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
    data: formData,
  })
}

export default {
  uploadImage,
  uploadModule,
}
