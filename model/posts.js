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
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const posts = mongoose.model(
  'posts',
  postsSchema,
)

export default posts
