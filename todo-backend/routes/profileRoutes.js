import express from 'express'
import User from '../models/userModel.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Update user profile
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    console.log('User ID:', userId) // Log user ID
    console.log('Request Body:', req.body) // Log request body to check if data is being sent

    const { profilePic, bio, settings } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic, bio, settings },
      { new: true, runValidators: true }
    )

    if (!updatedUser) return res.status(404).json({ message: 'User not found' })

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
