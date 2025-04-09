import User from '../models/userModel.js'

import express from 'express'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import Task from '../models/taskModel.js'

// Apply authMiddleware to protect all routes below
router.use(authMiddleware)

// ✅ Add a task to favorites
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

      // ✅ Log action
      user.history.push({
        action: 'Added to Favorites',
        taskId: task._id, // Correct reference
        taskTitle: task.title, // ✅ Include title
        timestamp: new Date()
      })
      await user.save()
    }

    res.json({ message: 'Task added to favorites' })
  } catch (error) {
    console.error('Error in marking task as favorite:', error) // Log error

    res.status(500).json({ error: 'Error adding task to favorites' })
  }
})

// ✅ Remove a task from favorites
router.delete('/:taskId/favorite', authMiddleware, async (req, res) => {
  try {
    console.log('Attempting to delete task with ID:', req.params.taskId)
    const task = await Task.findById(req.params.taskId)
    console.log('Task found:', task)

    if (!task) return res.status(404).json({ error: 'Task not found' })

    // Remove task ID from the user's favoriteTasks array
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.favoriteTasks = user.favoriteTasks.filter(id => !id.equals(task._id))
    await user.save()

    // ✅ Log action
    user.history.push({
      action: 'Removed from Favorites',
      taskId: task._id, // ✅ Correct reference
      taskTitle: task.title, // ✅ Include title
      timestamp: new Date()
    })
    await user.save()
    console.log('Favorite Tasks:', user.favoriteTasks)
    console.log('Task ID:', task._id)

    res.json({ message: 'Task removed from favorites' })
  } catch (error) {
    res.status(500).json({ error: 'Error removing task from favorites' })
  }
})

// ✅ Get all favorite tasks
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
