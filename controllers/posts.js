import { successHandler, errorHandler } from '../utils/responseHandler.js'
import Post from '../model/posts.js'

export default {
  async getPosts(req, res) {
    const postsRes = await Post.find()
    successHandler({ res, data: postsRes })
  },
  async addPosts(req, res) {
    try {
      console.log('req.body', req.body)

      const body = JSON.parse(req.body)
      const postRes = await Post.create(body)
      console.log('postRes', postRes)

      successHandler({ res, data: postRes })
    } catch (error) {
      errorHandler({ res, statusCode: 400, error: error.message })
    }
  },
}
