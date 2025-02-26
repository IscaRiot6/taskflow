import express from 'express'
import Task from '../models/taskModel.js'
const router = express.Router()

// In-memory tasks array
let tasks = []
let currentId = 1 // ID counter to ensure unique IDs

// ✅ Get all tasks
router.get('/', (req, res) => {
  console.log('📋 Fetching all tasks:', tasks)
  res.json(tasks)
})

// ✅ Add a new task (POST)
router.post('/', (req, res) => {
  const { title } = req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' })
  }

  const newTask = { id: currentId++, title: title.trim() }
  tasks.push(newTask)
  console.log('✅ Task added:', newTask)
  res.status(201).json(newTask)
})

// ✅ Update a task (PUT)
router.put('/:id', (req, res) => {
  const taskId = Number(req.params.id) // Convert ID to number
  console.log(`🔄 Updating task with ID: ${taskId}`)

  const { title } = req.body
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Updated task title is required' })
  }

  // Find task
  const task = tasks.find(task => task.id === taskId)
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  task.title = title.trim()
  console.log('✅ Task updated:', task)
  res.json(task)
})

// ✅ Delete a task (DELETE)
router.delete('/:id', (req, res) => {
  const taskId = Number(req.params.id)
  console.log(`🗑 Deleting task with ID: ${taskId}`)

  const initialLength = tasks.length
  tasks = tasks.filter(task => task.id !== taskId)

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' })
  }

  console.log(`✅ Remaining tasks:`, tasks)
  res.status(204).send() // No content
})

// Export router as default
export default router
