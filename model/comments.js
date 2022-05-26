import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'comment cannot be empty!'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'user must belong to a post'],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
    required: [true, 'comment must belong to a user'],
  },
}, { versionKey: false, timestamps: true })

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'id name photo',
  })
  next()
})
export const Comment = mongoose.model('comments', commentSchema)

export default Comment
