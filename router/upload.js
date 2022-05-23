import express from 'express'
import uploadController from '../controller/upload.js'
import imgur from '../service/imgur.js'

const router = express.Router()

router.get('/images', uploadController.getImages)

router.post('/image', imgur.uploadModule.single('image'), uploadController.uploadImage)

export default router
