import express from 'express'
import Task from '../models/taskModel.js' // Import your Task model
const router = express.Router()
import mongoose from 'mongoose'

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

// ✅ Get related tasks for a specific task
router.get('/:id/related', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('relatedTasks')
    if (!task) return res.status(404).json({ error: 'Task not found' })

    res.json(Array.isArray(task.relatedTasks) ? task.relatedTasks : [])
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST route to add a related task
// POST route to add a new related task
router.post('/:taskId/related', async (req, res) => {
  const { taskId } = req.params
  const { title, description, image, genres, themes, yourScore } = req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' })
  }

  try {
    const task = await Task.findById(taskId)
    if (!task) return res.status(404).json({ error: 'Task not found' })

    // Create a new task
    const newRelatedTask = new Task({
      title,
      description,
      image,
      genres,
      themes,
      yourScore
    })

    const savedTask = await newRelatedTask.save()

    // Add the new task to the relatedTasks array
    task.relatedTasks = Array.isArray(task.relatedTasks)
      ? task.relatedTasks
      : []
    task.relatedTasks.push(savedTask._id)

    await task.save()

    res
      .status(201)
      .json({
        message: 'Related task created and added',
        relatedTask: savedTask
      })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// ✅ Add a new task (POST)
router.post('/', async (req, res) => {
  try {
    const { title, description, image, genres, themes, yourScore } = req.body
    const newTask = new Task({
      title,
      description,
      image,
      genres,
      themes,
      yourScore
    })
    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' })
  }
})

// ✅ Update a task (PUT)
router.put('/:id', async (req, res) => {
  const taskId = req.params.id // Get the task ID from the URL
  const { title, description, image, genres, themes, yourScore, completed } =
    req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Updated task title is required' })
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title: title.trim(),
        description: description?.trim() || '',
        image: image || '',
        genres: genres || [],
        themes: themes || [],
        yourScore: yourScore || null,
        completed: completed ?? false
      },
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
