import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import http from 'http'

import connectDB from './models/db.js'
connectDB()
import tasksRoutes from './routes/tasks.js'
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'
import profileRoutes from './routes/profileRoutes.js'
import userStats from './routes/userStats.js'
import historyRoutes from './routes/historyRoutes.js'
import relatedTaskRoutes from './routes/relatedTasks.js'
import friendRoutes from './routes/friendRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import setupSocket from './socket/index.js'
import messageRoutes from './routes/messageRoutes.js'
import forumRoutes from './routes/forumRoutes.js'

// ✅ app first
const app = express()

// ✅ Now safe to use app to create the server
const server = http.createServer(app)

// ✅ Setup socket.io with server
setupSocket(server)

const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // your frontend
    credentials: true // allow cookies and authorization headers
  })
)
app.use(express.json())

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Use tasks routes
app.use('/api/tasks', tasksRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/user', userStats) //🟢🔴
app.use('/api/history', historyRoutes)
app.use('/api/related-tasks', relatedTaskRoutes)
app.use('/api/friends', friendRoutes)
app.use('/api/tasks', favoriteRoutes) // ✅
app.use('/api/messages', messageRoutes) // ✅
app.use('/api/forum', forumRoutes)

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
