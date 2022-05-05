import express from 'express'
import postsController from '../controller/posts.js'

const router = express.Router()

router.get('/', (req, res) => {
  postsController.getPosts(req, res)
})

router.post('/', (req, res) => {
  postsController.addPosts(req, res)
})

export default router
