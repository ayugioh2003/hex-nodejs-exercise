import { successHandler, errorHandler } from './utils/responseHandler.js'
import postsController from './controllers/posts.js'

export default function app(req, res) {
  req.body = ''
  req.on('data', (chunk) => {
    req.body += chunk
  })

  req.on('end', () => {
    if (req.url === '/') {
      successHandler({ res, data: 'Hello World' })
      return
    } if (req.method === 'OPTIONS') {
      successHandler({ res, data: 'Hello World' })
      return
    } if (req.url === '/posts' && req.method === 'GET') {
      postsController.getPosts(req, res)
      return
    } if (req.url === '/posts' && req.method === 'POST') {
      postsController.addPost(req, res)
      return
    } if (req.url.includes('/posts/') && req.method === 'PATCH') {
      postsController.updatePost(req, res)
      return
    } if (req.url.includes('/posts/') && req.method === 'DELETE') {
      postsController.deletePost(req, res)
      return
    } if (req.url === '/posts' && req.method === 'DELETE') {
      postsController.deletePosts(req, res)
      return
    }
    errorHandler({ res, statusCode: 404 })
  })
}
