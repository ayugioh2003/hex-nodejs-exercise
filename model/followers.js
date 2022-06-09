import mongoose from 'mongoose'

const followersSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    required: [true, '追蹤者 id 未填寫'],
    ref: 'users',
  },
  following: {
    type: mongoose.Schema.ObjectId,
    required: [true, '被追蹤者 id 未填寫'],
    ref: 'users',
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

followersSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'follower',
    select: 'id name photo',
  })
  this.populate({
    path: 'following',
    select: 'id name photo',
  })
  next()
})

const followers = mongoose.model(
  'followers',
  followersSchema,
)

export default followers
