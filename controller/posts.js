import { successHandler } from '../utils/responseHandler.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Post from '../model/posts.js'
import User from '../model/users.js'

export default {
  // GET /posts
  getPosts: catchAsync(async (req, res) => {
    // 取得資料: 網址列的 query
    const timeSort = req.query.sort === 'oldest' ? 'createdAt' : '-createdAt'
    const q = req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {}

    // 取得資料: posts 清單與篩選
    const postsDoc = await Post.find(q)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .sort(timeSort)
      .exec()
    // 取回關聯過的貼文
    // const postWithUserRes = await Post.aggregate([
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'user_id',
    //       foreignField: '_id',
    //       as: 'users',
    //     },
    //   },
    // ])
    successHandler({ res, data: postsDoc })
  }),
  // POST /posts
  addPosts: catchAsync(async (req, res, next) => {
    const { content, ...otherData } = req.body
    if (!content) {
      return next(new AppError({
        statusCode: 400,
        message: '內容不得為空',
      }))
    }

    // 初期測試用，隨便拿一個 user_id 給新增的貼文
    if (!req.body.user_id) {
      const userDoc = await User.find().limit(1)
      const { _id } = userDoc[0]
      req.body.user_id = _id.toString()
      console.log('req.body.user', req.body.user_id)
    }

    // 新增貼文
    const postDoc = await Post.create({ content, ...otherData, user: req.body.user_id })

    return successHandler({ res, data: postDoc })
  }),
  // PATCH /posts/:id
  updatePost: catchAsync(async (req, res, next) => {
    console.log('updatePost')
    const { content, ...otherData } = req.body
    if (!content) {
      return next(new AppError({
        statusCode: 400,
        message: 'content is required',
      }))
    }

    const id = req.params.post_id

    const post = await Post.findByIdAndUpdate(
      id,
      { content, ...otherData },
      { returnDocument: 'after', runValidators: true },
    )
    if (!id || !post) {
      return next(new AppError({
        statusCode: 400,
        message: 'Post not found',
      }))
    }

    return successHandler({ res, data: post })
  }),
  // DELETE /posts/:id
  deletePost: catchAsync(async (req, res, next) => {
    const id = req.params.post_id
    const data = await Post.findByIdAndDelete(id)

    if (!id || !data) {
      return next(new AppError({
        statusCode: 404,
        message: 'Post not found',
      }))
    }
    return successHandler({ res, data, message: '貼文刪除成功' })
  }),
  // DELETE /posts
  deletePosts: catchAsync(async (req, res, next) => {
    if (req.originalUrl === '/api/posts/') {
      return next(new AppError({
        statusCode: 400,
        message: 'not allowed api path',
      }))
    }

    await Post.deleteMany()
    const posts = await Post.find()
    return successHandler({ res, data: posts, message: '全部貼文刪除成功' })
  }),
}
