import mongoose from 'mongoose'

const imagesSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, '圖片網址為必填'],
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

const imagesModel = mongoose.model('images', imagesSchema)

export default imagesModel
