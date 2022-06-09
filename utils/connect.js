import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
)

const connectDB = async () => {
  try {
    await mongoose.connect(DB)
    console.log('MongoDB 資料庫連接成功')
  } catch (error) {
    console.log('連接資料庫失敗：', error)
  }
}

export default connectDB
export { connectDB }
