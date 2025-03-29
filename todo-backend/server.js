import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDB from './models/db.js'
connectDB()
import tasksRoutes from './routes/tasks.js'
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Use tasks routes
app.use('/api/tasks', tasksRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
