import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import User from '../model/users.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

dotenv.config({ path: '.env' })

export const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_DAY },
  )

  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        token,
      },
    },
  })
}

export const isAuth = catchAsync(async (req, res, next) => {
  // 驗證 token 是否存在
  let token
  const authValue = req.headers.authorization
  if (authValue && authValue.startsWith('Bearer')) {
    [, token] = authValue.split(' ')
  }
  if (!token) {
    return next(new AppError({ statusCode: 400, message: '你尚未登入！' }))
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) { reject(err) } else { resolve(payload) }
    })
  })

  // 驗證是否 User 資料存在
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError({ statusCode: 400, message: '目前帳號無法使用，請重新登入' }))
  }

  // req 攜帶 User 資料
  req.user = currentUser
  return next()
})

export default {
  isAuth,
  generateSendJWT,
}
