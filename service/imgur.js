import axios from 'axios'
import FormData from 'form-data'
import multer from 'multer'

// API
const uploadApiUrl = 'https://api.imgur.com/3/upload'

// 上傳圖片，設定格式
const uploadModule = multer({
  // 限制檔案需 10 MB內
  limit: {
    fileSize: 10000000,
  },
  // 只接受三種圖片格式
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('僅接受 jpg, jpeg, png 格式'))
    }
    cb(null, true)
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
