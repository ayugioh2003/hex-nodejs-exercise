import { successHandler, errorHandler } from '../utils/responseHandler.js'
import User from '../model/users.js'
import '../model/posts.js'

export default {
  async getUsers(req, res) {
    const usersDoc = await User.find().populate('posts').populate('postsCount').exec()
    successHandler({ res, data: usersDoc })
  },
  async addUsers(req, res) {
    try {
      const { body } = req
      const userRes = await User.create(body)
      const data = JSON.parse(JSON.stringify(userRes))
      delete data.password

      successHandler({ res, data })
    } catch (error) {
      errorHandler({ res, statusCode: 400, error: error.message })
    }
  },
}
