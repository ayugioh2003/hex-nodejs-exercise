import express from 'express'
import postsController from '../controller/posts.js'

const router = express.Router()

router.get('/', postsController.getPosts)

router.post('/', postsController.addPosts)

router.patch('/:post_id', postsController.updatePost)

router.delete('/:post_id', postsController.deletePost)

router.delete('/', postsController.deletePosts)

export default router
