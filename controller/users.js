import { successHandler, errorHandler } from '../utils/responseHandler.js'
import User from '../model/users.js'
import '../model/posts.js'
import catchAsync from '../utils/catchAsync.js'

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
}
