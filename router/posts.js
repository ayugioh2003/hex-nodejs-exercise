import express from 'express'
import postsController from '../controller/posts.js'

const router = express.Router()

router.get('/', (req, res) => {
  postsController.getPosts(req, res)
})

router.post('/', (req, res) => {
  postsController.addPost(req, res)
})

router.patch('/:post_id', (req, res) => {
  postsController.updatePost(req, res)
})

router.delete('/:post_id', (req, res) => {
  postsController.deletePost(req, res)
})

router.delete('/', (req, res) => {
  postsController.deletePosts(req, res)
})

export default router
