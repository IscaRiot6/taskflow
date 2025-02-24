require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Import tasks routes
const tasksRoutes = require('./routes/tasks')

// Use tasks routes
app.use('/api/tasks', tasksRoutes)

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
