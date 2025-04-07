import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
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

const app = express()
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
app.use('/api/user', userStats)
app.use('/api/history', historyRoutes)
app.use('/api/related-tasks', relatedTaskRoutes)
app.use('/api/friends', friendRoutes)

// app.use('/api/users/list') //  Return all users (maybe exclude current user)
// app.use('/api/users/add-friend/:friendId') // Push friend ID to user.friends
// app.use('/api/users/friends') // Return the user's friends' profiles

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
