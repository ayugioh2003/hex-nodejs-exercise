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
      console.log('req.body', req.body)

      const {
        content, ...otherData
      } = JSON.parse(req.body)
      if (!content) {
        errorHandler({ res, statusCode: 400, message: '內容不得為空' })
      }

      const postRes = await Post.create({ content, ...otherData })
      console.log('postRes', postRes)

      successHandler({ res, data: postRes })
    } catch (error) {
      errorHandler({ res, statusCode: 400, error: error.message })
    }
  },

  // PATCH /posts/:id
  async updatePost(req, res) {
    try {
      console.log('req.body', req.body)

      const { content, ...otherData } = JSON.parse(req.body)
      if (!content) {
        errorHandler({ res, statusCode: 400, message: 'content is required' })
      }

      console.log('req.url', req.url)
      const id = req.url.split('/posts/')[1]
      const post = await Post.findByIdAndUpdate(id, { content, ...otherData }, { returnDocument: 'after' })

      if (!id || !post) {
        return errorHandler({
          res,
          code: 404,
          message: 'Post not found',
        })
      }

      console.log('postRes', post)

      return successHandler({ res, data: post })
    } catch (error) {
      return errorHandler({
        res, statusCode: 400, message: req.url, error: error.message,
      })
    }
  },

  // DELETE /posts/:id
  async deletePost(req, res) {
    try {
      const id = req.url.split('/posts/')[1]
      const data = await Post.findByIdAndDelete(id)

      if (!id || !data) {
        return errorHandler({
          res,
          code: 404,
          message: 'Post not found',
        })
      }
      return successHandler({ res, data })
    } catch (error) {
      return errorHandler({ res, code: 400, errorMessage: error.message })
    }
  },

  // DELETE /posts
  async deletePosts(req, res) {
    try {
      const deleteRes = await Post.deleteMany()
      const posts = await Post.find()
      return successHandler({ res, data: posts })
    } catch (error) {
      return errorHandler({ res, code: 400, errorMessage: error.message })
    }
  },
}
