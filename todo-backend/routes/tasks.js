const express = require('express')
const router = express.Router()

// In-memory array to hold tasks
let tasks = []

// Route to get all tasks
router.get('/', (req, res) => {
  console.log('Fetching all tasks:', tasks)
  res.json(tasks)
})

// Route to add a new task
router.post('/', (req, res) => {
  const { title } = req.body // Extract title from request body

  // Validation: Ensure title exists and is not empty
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' })
  }

  const newTask = {
    id: tasks.length + 1, // Assign a new unique ID
    title: title.trim() // Trim spaces to avoid empty entries
  }

  tasks.push(newTask)
  console.log('Added new task:', newTask) // Log the newly added task
  console.log('Updated tasks array:', tasks) // Log the updated tasks array
  res.status(201).json(newTask)
})

// Route to update a task
router.put('/:id', (req, res) => {
  const { id } = req.params // Get the ID from the URL
  const updatedTask = req.body // Get the updated task data from the request body

  // Find the task by ID
  const taskIndex = tasks.findIndex(task => task.id === id)
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask } // Update the existing task
    console.log('Updated task:', tasks[taskIndex]) // Log the updated task
    res.json(tasks[taskIndex]) // Send back the updated task
  } else {
    res.status(404).send('Task not found') // Handle case where task ID doesn't exist
  }
})

// Route to delete a task
router.delete('/:id', (req, res) => {
  const { id } = req.params
  console.log(`Deleting task with id: ${id}`) // Log the ID being deleted
  tasks = tasks.filter(task => task.id !== id)
  console.log(`Remaining tasks: ${JSON.stringify(tasks)}`)
  res.status(204).send() // No content
})

module.exports = router
