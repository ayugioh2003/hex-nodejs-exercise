import express from 'express'
import postsController from '../controller/posts.js'
// utils
import { isAuth } from '../service/auth.js'

const router = express.Router()

// posts
router.get('/', isAuth, postsController.getPosts)
router.post('/', isAuth, postsController.addPosts)
router.patch('/:post_id', isAuth, postsController.updatePost)
router.delete('/:post_id', isAuth, postsController.deletePost)
router.delete('/', isAuth, postsController.deletePosts)

// post lists
router.get('/user/:user_id', isAuth, postsController.getUserPosts)
router.get('/getLikeList', isAuth, postsController.getLikeList)

// likes
router.patch('/:post_id/like', isAuth, postsController.toggleLike)

export default router
