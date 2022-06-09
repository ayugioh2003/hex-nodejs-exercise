import mongoose from 'mongoose'

const postsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, '作者 id 未填寫'],
    ref: 'users',
  },
  tags: [
    {
      type: String,
      required: [true, '貼文標籤 tags 未填寫'],
    },
  ],
  type: {
    type: String,
    enum: ['group', 'person'],
    required: [true, '貼文類型 type 未填寫'],
  },
  image: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: [true, 'Content 未填寫'],
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
    },
  ],
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

postsSchema.virtual('comments', {
  ref: 'comments',
  foreignField: 'post',
  localField: '_id',
})

const posts = mongoose.model(
  'posts',
  postsSchema,
)

export default posts
