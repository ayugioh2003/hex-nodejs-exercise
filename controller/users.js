import dotenv from 'dotenv'
import validator from 'validator'
import bcrypt from 'bcryptjs'

// models
import User from '../model/users.js'
import '../model/posts.js'
import Follower from '../model/followers.js'

// utils
import { successHandler } from '../utils/responseHandler.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { generateSendJWT } from '../service/auth.js'

// function
function checkPassword(password) {
  // 至少一數字、至少一英文字母、至少八字元
  const re = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/
  const result = re.test(password)

  return result
}

dotenv.config({ path: '.env' })

export default {
  // GET /users
  getUsers: catchAsync(async (req, res) => {
    const usersDoc = await User.find()
      .populate('posts').populate('postsCount').exec()
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
    if (!checkPassword(password)) {
      errors.push('密碼需包含至少一數字、一英文字母、八字元')
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

    const userRes = await User.findOne({ email })
    if (userRes) {
      return next(new AppError({
        statusCode: 400,
        message: 'Email 已被註冊',
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
    if (!checkPassword(password)) {
      return next(new AppError({ statusCode: 400, message: '密碼需至少一數字、一英文字符、八字元' }))
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
    const usersDoc = await User.findOne({ _id: req.user.id })
      .populate('posts')
      .populate({ path: 'followers', select: 'follower' })
      .populate({ path: 'following', select: 'following' })
      .exec()
    successHandler({ res, data: usersDoc })
  }),
  // GET /users/:user_id
  getUserById: catchAsync(async (req, res) => {
    const usersDoc = await User.findOne({ _id: req.params.user_id })
      .populate('posts')
      .populate({ path: 'followers', select: 'follower' })
      .populate({ path: 'following', select: 'following' })
      .exec()
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
  // ----------- 追蹤清單 ------------
  toggleFollowing: catchAsync(async (req, res, next) => {
    // 欄位處理
    if (req.params.user_id === req.user.id) {
      return next(new AppError({ statusCode: 400, message: '不可追蹤自己' }))
    }
    if (!req.params.user_id) {
      return next(new AppError({ statusCode: 400, message: '想要處理的追蹤對象不存在' }))
    }
    const followingUserDoc = await User.findOne({ _id: req.params.user_id })
    if (!followingUserDoc) {
      return next(new AppError({ statusCode: 400, message: '想要處理的追蹤對象不存在' }))
    }

    const followDoc = await Follower.findOne({
      follower: req.user.id,
      following: req.params.user_id,
    })

    if (!followDoc) {
      const followRes = await Follower.create({
        follower: req.user.id,
        following: req.params.user_id,
      })
      console.log('followRes', followRes)
      if (!followRes) {
        return next(new AppError({ statusCode: 400, message: '追蹤失敗' }))
      }
      return successHandler({ res, message: '成功追蹤', data: followRes })
    }
    const followRes = await Follower.findOneAndDelete({
      follower: req.user.id,
      following: req.params.user_id,
    })
    if (!followRes) {
      return next(new AppError({ statusCode: 400, message: '取消追蹤失敗' }))
    }
    return successHandler({ res, message: '成功取消追蹤', data: followRes })
  }),
  follow: catchAsync(async (req, res, next) => {
    // 欄位處理
    if (req.params.user_id === req.user.id) {
      return next(new AppError({ statusCode: 400, message: '不可追蹤自己' }))
    }
    if (!req.params.user_id) {
      return next(new AppError({ statusCode: 400, message: '想要處理的追蹤對象不存在' }))
    }
    const followingUserDoc = await User.findOne({ _id: req.params.user_id })
    if (!followingUserDoc) {
      return next(new AppError({ statusCode: 400, message: '想要處理的追蹤對象不存在' }))
    }

    const followDoc = await Follower.findOne({
      follower: req.user.id,
      following: req.params.user_id,
    })

    if (!followDoc) {
      const followRes = await Follower.create({
        follower: req.user.id,
        following: req.params.user_id,
      })
      console.log('followRes', followRes)
      if (!followRes) {
        return next(new AppError({ statusCode: 400, message: '追蹤失敗' }))
      }
      return successHandler({ res, message: '成功追蹤', data: followRes })
    }
    return successHandler({ res, message: '已追蹤' })
  }),
  unfollow: catchAsync(async (req, res, next) => {
    // 欄位處理
    if (req.params.user_id === req.user.id) {
      return next(new AppError({ statusCode: 400, message: '不可追蹤/取消追蹤自己' }))
    }
    if (!req.params.user_id) {
      return next(new AppError({ statusCode: 400, message: '想要處理的追蹤對象不存在' }))
    }
    const followingUserDoc = await User.findOne({ _id: req.params.user_id })
    if (!followingUserDoc) {
      return next(new AppError({ statusCode: 400, message: '想要處理的追蹤對象不存在' }))
    }

    const followDoc = await Follower.findOne({
      follower: req.user.id,
      following: req.params.user_id,
    })

    if (!followDoc) {
      return successHandler({ res, message: '已取消追蹤' })
    }

    const followRes = await Follower.findOneAndDelete({
      follower: req.user.id,
      following: req.params.user_id,
    })
    if (!followRes) {
      return next(new AppError({ statusCode: 400, message: '取消追蹤失敗' }))
    }
    return successHandler({ res, message: '成功取消追蹤', data: followRes })
  }),
  getFollowers: catchAsync(async (req, res) => {
    // 關注目前使用者的人 (追蹤者、粉絲)
    const followersDoc = await Follower
      .find({ following: req.user.id }, 'follower following')
      .populate('follower', 'name photo').exec()

    // 目前使用者關注的人 (追蹤名單)
    const followingDoc = await Follower
      .find({ follower: req.user.id })
      .populate('following', 'name photo').exec()

    successHandler({
      res,
      data: {
        followers: followersDoc.map((record) => record.follower),
        following: followingDoc.map((record) => record.following),
      },
    })
  }),
  getFollowersByID: catchAsync(async (req, res) => {
    // 關注目前使用者的人 (追蹤者、粉絲)
    const followersDoc = await Follower
      .find({ following: req.params.user_id }, 'follower following')
      .populate('follower', 'name photo').exec()

    // 目前使用者關注的人 (追蹤名單)
    const followingDoc = await Follower
      .find({ follower: req.params.user_id })
      .populate('following', 'name photo').exec()

    successHandler({
      res,
      data: {
        followers: followersDoc.map((record) => record.follower),
        following: followingDoc.map((record) => record.following),
      },
    })
  }),
  // AI 推薦寫法
  // toggleFolloweing: catchAsync(async (req, res) => {
  //   const { userId } = req.params
  //   const user = await User.findById(req.user.id)
  //   const isFollowing = user.following.includes(userId)
  //   if (isFollowing) {
  //     user.following = user.following.filter((id) => id !== userId)
  //   } else {
  //     user.following.push(userId)
  //   }
  //   await user.save()
  //   successHandler({ res, data: user })
  // }),

}
