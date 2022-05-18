import express from 'express'
import uploadController from '../controller/upload.js'
import imgur from '../service/imgur.js'

const router = express.Router()

router.get('/images', (req, res) => {
  uploadController.getImages(req, res)
})

router.post('/image', imgur.uploadModule.single('image'), (req, res) => {
  uploadController.uploadImage(req, res)
})

export default router
