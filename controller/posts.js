import { successHandler, errorHandler } from '../utils/responseHandler.js'
import Post from '../model/posts.js'
import User from '../model/users.js'

export default {
  async getPosts(req, res) {
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
  },
  async addPosts(req, res) {
    try {
      // 初期測試用，隨便拿一個 user_id 給新增的貼文
      if (!req.body.user_id) {
        const userDoc = await User.find().limit(1)
        const { _id } = userDoc[0]
        req.body.user = _id
      }

      // 新增貼文
      const { body } = req
      const postDoc = await Post.create(body)

      successHandler({ res, data: postDoc })
    } catch (error) {
      errorHandler({ res, statusCode: 400, error: error.message })
    }
  },
}
