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
    } if (req.method === 'OPTIONS') {
      successHandler({ res, data: 'Hello World' })
    } else if (req.url === '/posts' && req.method === 'GET') {
      postsController.getPosts(req, res)
    } else if (req.url === '/posts' && req.method === 'POST') {
      postsController.addPosts(req, res)
    } else {
      errorHandler({ res, statusCode: 404 })
    }
  })
}
