import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import router from './router/index.js'
import { errorHandler } from './utils/responseHandler.js'
import globalError from './controller/globalError.js'

const app = express()

// middleware
app.use(morgan('dev')) // 日誌
app.use(express.json()) // 接收 body 為 json 格式資料
app.use(express.urlencoded({ extended: true })) // url-form-encoded
app.use(cors()) // 跨域

// middleware
// const checkKeyword = (req, res, next) => {
//   if (req.query.q) {
//     next()
//   } else {
//     res.status(400).json({
//       message: '少q: 你不傳關鍵字你要說啊',
//     })
//   }
// }

// 工程師錯誤：捕捉程式錯誤
process.on('uncaughtException', (err) => {
  // console.error('未捕捉到的 rejection:', promise, '原因:', reason)
  console.error('ERROR: Uncaughted Exception!')
  console.error(err.name)
  console.error(err.message)
  console.error(err.stack) // nodejs 獨有的屬性
  process.exit(1)
})
// 操作錯誤：捕捉未處理的 promise catch
// 會跟 promise.catch() 搶優先權，先註解掉
process.on('unhandledRejection', (reason, promise) => {
  console.error('ERROR: Unhandled Rejection!')
  console.error('未捕捉到的 rejection：', promise, '原因：', reason)
})

// routes
app.get('/', (req, res) => {
  res.status(200).json({
    name: '洧杰',
  })
})
app.use((req, res, next) => {
  console.log('小夫，我要進來了')
  next()
})

app.use('/api/posts', router.postRouter)
app.use('/api/users', router.userRouter)
app.use('/api/upload', router.uploadRouter)

// error handle
app.use('*', (req, res) => {
  errorHandler({ res, statusCode: 404 })
})
app.use(globalError)

export default app
