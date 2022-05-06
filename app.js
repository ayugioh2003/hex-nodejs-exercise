import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
// import postRouter from './router/posts.js'
import router from './router/index.js'
import { successHandler, errorHandler } from './utils/responseHandler.js'

const app = express()

// middleware
app.use(morgan('dev')) // 日誌
app.use(express.json()) // 接收 body 為 json 格式資料
app.use(express.urlencoded({ extended: true })) // url-form-encoded
app.use(cors()) // 跨域

// routes

app.get('/', (req, res) => {
  res.status(200).json({
    name: '洧杰',
  })
})
app.use('/api/posts', router.postRouter)
app.use('/api/users', router.userRouter)

app.use('*', (req, res) => {
  errorHandler({ res, statusCode: 404 })
})

export default app
