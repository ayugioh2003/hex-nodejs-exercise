import express from 'express'
import usersController from '../controller/users.js'
// utils
import { isAuth } from '../service/auth.js'

const router = express.Router()

// 追蹤
router.patch('/:user_id/follow', isAuth, usersController.toggleFollowing)
router.post('/:user_id/follow', isAuth, usersController.follow)
router.delete('/:user_id/unfollow', isAuth, usersController.unfollow)
router.get('/followers', isAuth, usersController.getFollowers)
router.get('/following', isAuth, usersController.getFollowers)
router.get('/:user_id/followers', isAuth, usersController.getFollowersByID)

// 使用者
router.get('/', isAuth, usersController.getUsers)

router.post('/', isAuth, usersController.addUser)

router.post('/sign_up', usersController.signUp)

router.post('/sign_in', usersController.signIn)

router.patch('/updatePassword', isAuth, usersController.updatePassword)

router.get('/profile', isAuth, usersController.getUser)

router.patch('/profile', isAuth, usersController.updateUser)

router.get('/:user_id', isAuth, usersController.getUserById)

export default router
