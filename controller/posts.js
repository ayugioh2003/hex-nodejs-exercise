import { successHandler } from '../utils/responseHandler.js'
// utils
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
// models
import Post from '../model/posts.js'
import Comment from '../model/comments.js'

export default {
  // ---------------------------- 貼文 ----------------------------
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
      .populate({
        path: 'likes',
        select: 'name photo',
      })
      .populate({
        path: 'comments',
        select: 'comment user createdAt',
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

    // 新增貼文
    const postDoc = await Post.create({ content, ...otherData, user: req.user.id })

    return successHandler({ res, data: postDoc })
  }),
  // GET /posts/:id
  getPost: catchAsync(async (req, res, next) => {
    // 取得資料: posts 清單與篩選
    const postsDoc = await Post.findOne({ _id: req.params.post_id })
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .populate({
        path: 'likes',
        select: 'name photo',
      })
      .populate({
        path: 'comments',
        select: 'comment user createdAt',
      })
      .exec()
    return successHandler({ res, data: postsDoc })
  }),
  // PATCH /posts/:id
  updatePost: catchAsync(async (req, res, next) => {
    const { content, ...otherData } = req.body
    if (!content) {
      return next(new AppError({
        statusCode: 400,
        message: 'content is required',
      }))
    }

    const id = req.params.post_id

    const post = await Post.findOneAndUpdate(
      { id, user: req.user.id },
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
    const data = await Post.findOneAndDelete({ id, user: req.user.id })

    if (!id || !data) {
      return next(new AppError({
        statusCode: 404,
        message: 'Post not found',
      }))
    }
    return successHandler({ res, data, message: '貼文刪除成功' })
  }),
  // DELETE /posts
  // 測試時使用
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
  // ---------------------------- 按讚 ----------------------------
  toggleLike: catchAsync(async (req, res, next) => {
    const { post_id } = req.params
    const { toggleType } = req.body

    if (!post_id) {
      return next(new AppError({ statusCode: 400, message: 'post id is empty' }))
    }

    if (['add', 'remove'].indexOf(toggleType) === -1) {
      return next(new AppError({ statusCode: 400, message: 'toggleType is invalid' }))
    }

    if (toggleType === 'add') {
      const toggleRes = await Post.findOneAndUpdate(
        { _id: post_id },
        { $addToSet: { likes: req.user.id } },
        { returnDocument: 'after', runValidators: true },
      )
      if (!toggleRes) {
        return next(new AppError({ statusCode: 400, message: '按讚失敗' }))
      }
      console.log('toggleRes', toggleRes)
      return successHandler({ res, message: '成功按讚', data: toggleRes })
    }

    if (toggleType === 'remove') {
      const toggleRes = await Post.findOneAndUpdate(
        { _id: post_id },
        { $pull: { likes: req.user.id } },
        { returnDocument: 'after', runValidators: true },
      )
      if (!toggleRes) {
        return next(new AppError({ statusCode: 400, message: '取消讚失敗' }))
      }
      return successHandler({ res, message: '成功取消讚', data: toggleRes })
    }
  }),
  like: catchAsync(async (req, res, next) => {
    const { post_id } = req.params

    if (!post_id) {
      return next(new AppError({ statusCode: 400, message: 'post id is empty' }))
    }

    const likeRes = await Post.findOneAndUpdate(
      { _id: post_id },
      { $addToSet: { likes: req.user.id } },
      { returnDocument: 'after', runValidators: true },
    )
    if (!likeRes) {
      return next(new AppError({ statusCode: 400, message: '按讚失敗' }))
    }
    console.log('toggleRes', likeRes)
    return successHandler({ res, message: '成功按讚', data: likeRes })
  }),
  unlike: catchAsync(async (req, res, next) => {
    const { post_id } = req.params

    if (!post_id) {
      return next(new AppError({ statusCode: 400, message: 'post id is empty' }))
    }

    const likeRes = await Post.findOneAndUpdate(
      { _id: post_id },
      { $pull: { likes: req.user.id } },
      { returnDocument: 'after', runValidators: true },
    )
    if (!likeRes) {
      return next(new AppError({ statusCode: 400, message: '取消讚失敗' }))
    }
    return successHandler({ res, message: '成功取消讚', data: likeRes })
  }),
  // ---------------------------- 列表 ----------------------------
  // GET /posts/user/:post_id
  getUserPosts: catchAsync(async (req, res) => {
    const user = req.params.user_id
    const posts = await Post.find({ user })

    successHandler({
      res, message: '成功取得使用者貼文列表', results: posts.length, data: posts,
    })
  }),
  // GET /posts/getLikeList
  getLikeList: catchAsync(async (req, res) => {
    const likePosts = await Post
      .find({ likes: { $in: [req.user.id] } })
      .populate({
        path: 'user',
        select: 'name _id photo',
      })

    successHandler({
      res, message: '成功取得使用者按讚貼文列表', results: likePosts.length, data: likePosts,
    })
  }),
  // ----------------------------  留言 ----------------------------
  // GET /posts/:post_id/comments
  addComment: catchAsync(async (req, res, next) => {
    const user = req.user.id
    const post = req.params.post_id
    const { comment } = req.body

    if (!user || !post || !comment) {
      return next(new AppError({ statusCode: 400, message: '使用者ID、貼文ID、貼文內容不得為空' }))
    }

    const postRes = await Post.findOne({ _id: post })
    if (!postRes) {
      return next(new AppError({ statusCode: 400, message: '此篇貼文不存在' }))
    }

    const newComment = await Comment.create({
      post, user, comment,
    })
    return successHandler({ res, data: { comments: newComment } })
  }),
  // 切換按讚狀態 AI 建議寫法
  // toggleLike: catchAsync(async (req, res, next) => {
  //   const { id } = req.params
  //   const post = await Post.findOne({ id })
  //   if (!post) {
  //     return next(new AppError({
  //       statusCode: 404,
  //       message: 'Post not found',
  //     }))
  //   }

  //   const user = req.user.id
  //   const isLiked = post.likes.includes(user)
  //   if (isLiked) {
  //     post.likes = post.likes.filter((like) => like !== user)
  //   } else {
  //     post.likes.push(user)
  //   }

  //   await post.save()
  //   return successHandler({ res, data: post })
  // }),
}
