import express from 'express'
import usersController from '../controller/users.js'
// utils
import { isAuth } from '../service/auth.js'

const router = express.Router()

router.get('/', isAuth, usersController.getUsers)

router.post('/', isAuth, usersController.addUser)

router.post('/sign_up', usersController.signUp)

router.post('/sign_in', usersController.signIn)

router.patch('/updatePassword', isAuth, usersController.updatePassword)

router.get('/profile', isAuth, usersController.getUser)

router.patch('/profile', isAuth, usersController.updateUser)

export default router
