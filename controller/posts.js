import { successHandler, errorHandler } from '../utils/responseHandler.js'
import Post from '../model/posts.js'

export default {
  // GET /posts
  async getPosts(req, res) {
    const postsRes = await Post.find()
    successHandler({ res, data: postsRes })
  },

  // POST /posts
  async addPost(req, res) {
    try {
      const { content, ...otherData } = req.body
      if (!content) {
        return errorHandler({ res, statusCode: 400, message: '內容不得為空' })
      }

      const postRes = await Post.create({ content, ...otherData })
      console.log('postRes', postRes)

      return successHandler({ res, data: postRes })
    } catch (error) {
      return errorHandler({ res, statusCode: 400, error: error.message })
    }
  },

  // PATCH /posts/:id
  async updatePost(req, res) {
    try {
      const { content, ...otherData } = req.body
      if (!content) {
        return errorHandler({
          res,
          statusCode: 400,
          message: 'content is required',
        })
      }

      const id = req.params.post_id

      const post = await Post.findByIdAndUpdate(
        id,
        { content, ...otherData },
        { returnDocument: 'after', runValidators: true },
      )
      if (!id || !post) {
        return errorHandler({
          res,
          code: 404,
          message: 'Post not found',
        })
      }

      return successHandler({ res, data: post })
    } catch (error) {
      return errorHandler({
        res,
        statusCode: 400,
        error: error.message,
      })
    }
  },

  // DELETE /posts/:id
  async deletePost(req, res) {
    console.log('123')
    try {
      const id = req.params.post_id
      const data = await Post.findByIdAndDelete(id)

      if (!id || !data) {
        return errorHandler({
          res,
          code: 404,
          message: 'Post not found',
        })
      }
      return successHandler({ res, data, message: '刪除成功' })
    } catch (error) {
      return errorHandler({ res, code: 400, message: error.message })
    }
  },

  // DELETE /posts
  async deletePosts(req, res) {
    console.log('req.originalUrl', req.originalUrl)
    console.log(req.originalUrl === '/api/posts/')
    if (req.originalUrl === '/api/posts/') {
      return errorHandler({
        res,
        statusCode: 400,
        message: 'not allowed api path',
      })
    }
    try {
      const deleteRes = await Post.deleteMany()
      const posts = await Post.find()
      return successHandler({ res, data: posts, message: '刪除成功' })
    } catch (error) {
      return errorHandler({ res, statusCode: 400, message: error.message })
    }
  },
}
