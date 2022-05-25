import http from 'http'
import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './utils/connect.js'

dotenv.config({ path: '.env' })
connectDB()

const server = http.createServer(app)
const PORT = process.env.PORT || 3000

server.listen(PORT)
console.log(`Server running at http://localhost:${PORT}/`)
