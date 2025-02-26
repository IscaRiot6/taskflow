import express from 'express'
import Task from '../models/taskModel.js' // Import your Task model
const router = express.Router()

// ✅ Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find() // Fetch tasks from MongoDB
    console.log('📋 Fetching all tasks:', tasks)
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// ✅ Add a new task (POST)
router.post('/', async (req, res) => {
  const { title } = req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' })
  }

  const newTask = new Task({ title: title.trim() }) // Create a new Task instance
  try {
    const savedTask = await newTask.save() // Save the task to MongoDB
    console.log('✅ Task added:', savedTask)
    res.status(201).json(savedTask)
  } catch (error) {
    console.error('Error adding task:', error)
    res.status(500).json({ error: 'Failed to add task' })
  }
})

// ✅ Update a task (PUT)
router.put('/:id', async (req, res) => {
  const taskId = req.params.id // Get the task ID from the URL
  const { title } = req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Updated task title is required' })
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title: title.trim() },
      { new: true, runValidators: true } // Return the updated task and validate
    )

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    console.log('✅ Task updated:', updatedTask)
    res.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// ✅ Delete a task (DELETE)
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id
  console.log(`🗑 Deleting task with ID: ${taskId}`)

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId) // Delete the task from MongoDB

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    console.log(`✅ Task deleted:`, deletedTask)
    res.status(204).send() // No content
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// Export router as default
export default router
