import express from 'express'
import User from '../models/userModel.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Get user history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user.history.sort((a, b) => b.timestamp - a.timestamp))
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving history' })
  }
})

export default router
