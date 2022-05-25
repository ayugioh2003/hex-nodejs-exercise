import dotenv from 'dotenv'
import validator from 'validator'
import bcrypt from 'bcryptjs'

// models
import User from '../model/users.js'
import '../model/posts.js'

// utils
import { successHandler } from '../utils/responseHandler.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { generateSendJWT } from '../service/auth.js'

dotenv.config({ path: '.env' })

export default {
  // GET /users
  getUsers: catchAsync(async (req, res) => {
    const usersDoc = await User.find().populate('posts', 'postsCount').exec()
    successHandler({ res, data: usersDoc })
  }),
  // POST /users
  addUser: catchAsync(async (req, res) => {
    const { body } = req
    const userRes = await User.create(body)

    successHandler({
      res,
      data: {
        // eslint-disable-next-line no-underscore-dangle
        _id: userRes._id,
        email: userRes.email,
        name: userRes.name,
        photo: userRes.photo,
        createdAt: userRes.createdAt,
      },
    })
  }),
  // POST /users/sign_up
  signUp: catchAsync(async (req, res, next) => {
    const { email, confirmPassword, name } = req.body
    let { password } = req.body

    // ------------ 欄位驗證 --------------
    const errors = []
    if (!email || !password || !confirmPassword || !name) {
      errors.push('email, password, confirmPassword, name 欄位不可為空')
    }
    if (password !== confirmPassword) {
      errors.push('密碼不一致')
    }
    if (!validator.isLength(password, { min: 8 })) {
      errors.push('密碼字數低於 8 碼')
    }
    if (!validator.isEmail(email)) {
      errors.push('Email 格式不正確')
    }

    if (errors.length > 0) {
      return next(new AppError({
        statusCode: 400,
        message: '缺少欄位或格式錯誤',
        errors,
      }))
    }

    // ---------- 密碼加密 --------------
    password = await bcrypt.hash(req.body.password, 12)

    const userDoc = await User.create({
      email,
      password,
      name,
    })

    return generateSendJWT(userDoc, 200, res)

    // successHandler({
    //   res,
    //   data: {
    //     ...req.body,
    //   },
    // })
  }),
  // POST /users/sign_in
  signIn: catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new AppError({
        statusCode: 400,
        message: '帳號密碼不可為空',
      }))
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return next(new AppError({
        statusCode: 400,
        message: '此帳號不存在、或密碼錯誤',
      }))
    }

    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return next(new AppError({
        statusCode: 400,
        message: '密碼錯誤、或此帳號不存在',
      }))
    }
    return generateSendJWT(user, 200, res)
  }),
  // PATCH /users/updatePassword
  updatePassword: catchAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body
    if (!password || !confirmPassword) {
      return next(new AppError({ statusCode: 400, message: '密碼不可為空' }))
    }
    if (password !== confirmPassword) {
      return next(new AppError({ statusCode: 400, message: '密碼不相符' }))
    }
    const newPassword = await bcrypt.hash(password, 12)

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { password: newPassword },
      { returnDocument: 'after', runValidators: true },
    )
    return generateSendJWT(user, 200, res)
  }),
  // GET /users/profile
  getUser: catchAsync(async (req, res) => {
    const usersDoc = await User.findOne({ _id: req.user.id }).populate('posts').exec()
    successHandler({ res, data: usersDoc })
  }),
  // PATCH /users/profile
  updateUser: catchAsync(async (req, res) => {
    const { name, photo } = req.body
    const userDoc = await User.findByIdAndUpdate(
      req.user.id,
      { name, photo },
      { returnDocument: 'after', runValidators: true },
    )
    successHandler({ res, data: userDoc })
  }),

}
