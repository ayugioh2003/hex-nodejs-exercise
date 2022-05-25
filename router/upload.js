import express from 'express'
import uploadController from '../controller/upload.js'
import imgur from '../service/imgur.js'
import { isAuth } from '../service/auth.js'

const router = express.Router()

router.get('/images', uploadController.getImages)

router.post('/image', isAuth, imgur.uploadModule.single('image'), uploadController.uploadImage)

export default router
