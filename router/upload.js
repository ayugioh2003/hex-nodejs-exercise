import express from 'express'
import uploadController from '../controller/upload.js'
import { uploadModule } from '../service/imgur.js'
import { isAuth } from '../service/auth.js'

const router = express.Router()

router.get('/images', uploadController.getImages)

router.post('/image', isAuth, uploadModule.single('image'), uploadController.uploadImage)

router.post('/imageToAlbum', isAuth, uploadModule.single('image'), uploadController.uploadImageToAlbum)

export default router
