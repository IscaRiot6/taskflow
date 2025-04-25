import express from 'express'
import User from '../models/userModel.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Fetch count of saved tasks (Secure: Only the logged-in user can access)
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ count: user.tasks.length }) // ✅ Matches schema field name
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Fetch count of favorite tasks (Secure: Only the logged-in user can access)
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ count: user.favoriteTasks.length }) // ✅ Matches schema field name
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// 🟢🟢 FETCH ONLINE USERS 🔴🔴
router.get('/online/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ online: user.online })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
