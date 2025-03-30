import express from 'express'
import Task from '../models/taskModel.js'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'

// Apply authMiddleware to protect all routes below
router.use(authMiddleware)

// ✅ Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }) // Fetch only user-specific tasks
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

// POST route to add a new related task
router.post('/:taskId/related', async (req, res) => {
  const { taskId } = req.params
  const { title, description, image, image2, genres, themes, yourScore } =
    req.body

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
      image2,
      genres,
      themes,
      yourScore,
      user: task.user // Ensure the new related task has the same user
    })

    const savedTask = await newRelatedTask.save()

    // Add the new task to the relatedTasks array
    task.relatedTasks = Array.isArray(task.relatedTasks)
      ? task.relatedTasks
      : []
    task.relatedTasks.push(savedTask._id)

    await task.save()

    res.status(201).json({
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
    const { title, description, image, image2, genres, themes, yourScore } =
      req.body

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' })
    }

    const newTask = new Task({
      title,
      description,
      image,
      image2,
      genres,
      themes,
      yourScore,
      user: req.user.userId
    })

    const savedTask = await newTask.save()

    // Check if user exists before updating
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Add task ID to user's tasks array
    user.tasks.push(savedTask._id)
    await user.save()

    res.status(201).json(savedTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Error creating task' })
  }
})

// ✅ Update a task (PUT)
router.put('/:id', async (req, res) => {
  const taskId = req.params.id // Get the task ID from the URL
  const {
    title,
    description,
    image,
    image2,
    genres,
    themes,
    yourScore,
    completed
  } = req.body

  try {
    // First, find the current task
    const task = await Task.findOne({ _id: taskId, user: req.user.userId })
    if (!task) {
      return res.status(404).json({
        error: 'Task not found or you are not authorized to update this task'
      })
    }

    // Prepare the data to be updated, only update provided fields
    const updatedData = {}

    // Only update the title if a new one is provided
    if (title && title !== task.title) {
      updatedData.title = title.trim()
    }
    if (description !== undefined)
      updatedData.description = description?.trim() || ''
    if (image !== undefined) updatedData.image = image || ''
    if (image2 !== undefined) updatedData.image2 = image2 || ''
    if (genres !== undefined) updatedData.genres = genres || []
    if (themes !== undefined) updatedData.themes = themes || []
    if (yourScore !== undefined) updatedData.yourScore = yourScore || null
    if (completed !== undefined) updatedData.completed = completed ?? false

    // Update the task using `findByIdAndUpdate` with only updated fields
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
      new: true,
      runValidators: true
    })

    // If no task is found, return an error
    if (!updatedTask) {
      return res.status(404).json({ error: 'Failed to update task' })
    }

    // Log and return the updated task
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
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user.userId
    }) // Ensure the user owns the task

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    // Remove the deleted task from the user's tasks array
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { tasks: taskId }
    })

    console.log(`✅ Task deleted:`, deletedTask)
    res.status(204).send() // No content
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// Add a task to favorites
router.put('/:taskId/favorite', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)

    if (!task) {
      console.error('Task not found:', taskId) // Log taskId
      return res.status(404).json({ message: 'Task not found' })
    }

    // Add task ID to the users favoriteTasks array if it's not already there
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (!user.favoriteTasks.includes(task._id)) {
      user.favoriteTasks.push(task._id)
      await user.save()
    }

    res.json({ message: 'Task added to favorites' })
  } catch (error) {
    console.error('Error in marking task as favorite:', error) // Log error

    res.status(500).json({ error: 'Error adding task to favorites' })
  }
})

// Remove a task from favorites
router.delete('/:taskId/favorite', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)

    if (!task) return res.status(404).json({ error: 'Task not found' })

    // Remove task ID from the user's favoriteTasks array
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.favoriteTasks = user.favoriteTasks.filter(id => !id.equals(task._id))
    await user.save()

    res.json({ message: 'Task removed from favorites' })
  } catch (error) {
    res.status(500).json({ error: 'Error removing task from favorites' })
  }
})

// Fetch user's favorite tasks
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favoriteTasks')
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json(user.favoriteTasks) // Return the user's favorite tasks
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorite tasks' })
  }
})

export default router
