import express from 'express'
import postsController from '../controller/posts.js'
// utils
import { isAuth } from '../service/auth.js'

const router = express.Router()

router.get('/', isAuth, postsController.getPosts)

router.post('/', isAuth, postsController.addPosts)

router.patch('/:post_id', isAuth, postsController.updatePost)

router.delete('/:post_id', isAuth, postsController.deletePost)

router.delete('/', isAuth, postsController.deletePosts)

export default router
