import express from 'express'
import User from '../models/userModel.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Get user history
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('User ID from authMiddleware:', req.user.userId) // 🔍 Debugging line

    const user = await User.findById(req.user.userId)

    if (!user) {
      console.log('User not found') // 🔍 Debugging line
      return res.status(404).json({ error: 'User not found' })
    }

    console.log('User history:', user.history) // 🔍 Debugging line
    res.json(user.history.sort((a, b) => b.timestamp - a.timestamp))
  } catch (error) {
    console.error('Error retrieving history:', error) // 🔍 Debugging line
    res.status(500).json({ error: 'Error retrieving history' })
  }
})

export default router
