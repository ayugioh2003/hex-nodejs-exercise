import express from 'express'
import usersController from '../controller/users.js'

const router = express.Router()

router.get('/', usersController.getUsers)

router.post('/', usersController.addUser)

export default router
