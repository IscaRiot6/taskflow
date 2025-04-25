import express from 'express'
import User from '../models/userModel.js'
import authMiddleware from '../middleware/authMiddleware.js'
import Task from '../models/taskModel.js'

const router = express.Router()

// Get user history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean() // Convert Mongoose doc to plain JS object

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // ✅ Use the stored taskTitle directly instead of re-fetching deleted tasks
    const historyWithTitles = user.history.map(entry => ({
      ...entry,
      taskTitle: entry.taskTitle || 'Unknown Task' // Use saved title, fallback if missing
    }))

    // Sort by timestamp (newest first) and return
    res.json(historyWithTitles.sort((a, b) => b.timestamp - a.timestamp))
  } catch (error) {
    console.error('Error retrieving history:', error)
    res.status(500).json({ error: 'Error retrieving history' })
  }
})

export default router
