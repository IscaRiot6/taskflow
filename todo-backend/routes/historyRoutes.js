import express from 'express'
import User from '../models/userModel.js'
import authMiddleware from '../middleware/authMiddleware.js'
import Task from '../models/taskModel.js' // Adjust path if necessary

const router = express.Router()

// Get user history
// Get user history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean() // Convert Mongoose doc to plain JS object

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Fetch task details for each history entry
    const historyWithTitles = await Promise.all(
      user.history.map(async entry => {
        if (!entry.taskId) {
          return entry // Skip if taskId is missing
        }

        const task = await Task.findById(entry.taskId).select('title') // Get task title
        return {
          ...entry,
          taskTitle: task ? task.title : 'Unknown Task' // Attach title or fallback
        }
      })
    )

    // Sort by timestamp (newest first) and return
    res.json(historyWithTitles.sort((a, b) => b.timestamp - a.timestamp))
  } catch (error) {
    console.error('Error retrieving history:', error)
    res.status(500).json({ error: 'Error retrieving history' })
  }
})

export default router
