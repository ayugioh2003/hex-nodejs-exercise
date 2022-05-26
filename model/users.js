import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入您的名字'],
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, '請輸入您的密碼'],
    select: false,
  },
  photo: String,
  sex: {
    type: String,
    enum: ['male', 'female'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super'],
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

usersSchema.virtual('postsCount', {
  ref: 'posts',
  localField: '_id',
  foreignField: 'user',
  count: true,
})
usersSchema.virtual('posts', {
  ref: 'posts',
  localField: '_id',
  foreignField: 'user',
})
usersSchema.virtual('followers', {
  ref: 'followers',
  localField: '_id',
  foreignField: 'following',
})
usersSchema.virtual('following', {
  ref: 'followers',
  localField: '_id',
  foreignField: 'follower',
})

const users = mongoose.model(
  'users',
  usersSchema,
)

export default users
