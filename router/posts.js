import express from 'express'
import postsController from '../controller/posts.js'
// utils
import { isAuth } from '../service/auth.js'

const router = express.Router()

// post lists
router.get('/user/:user_id', isAuth, postsController.getUserPosts)
router.get('/getLikeList', isAuth, postsController.getLikeList)

// posts
router.get('/', isAuth, postsController.getPosts)
router.post('/', isAuth, postsController.addPosts)
router.get('/:post_id', isAuth, postsController.getPost)
router.patch('/:post_id', isAuth, postsController.updatePost)
router.delete('/:post_id', isAuth, postsController.deletePost)
router.delete('/', isAuth, postsController.deletePosts)

// likes
router.patch('/:post_id/like', isAuth, postsController.toggleLike)
router.post('/:post_id/like', isAuth, postsController.like)
router.delete('/:post_id/like', isAuth, postsController.unlike)

// comments
router.post('/:post_id/comment', isAuth, postsController.addComment)

export default router
