import express from 'express'
import usersController from '../controller/users.js'

const router = express.Router()

router.get('/', (req, res) => {
  usersController.getUsers(req, res)
})

router.post('/', (req, res) => {
  usersController.addUsers(req, res)
})

export default router
