import express from 'express'
import User from '../models/userModel.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// This route will be used to get the logged-in user's profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId // Get the userId from the decoded JWT (via authMiddleware)
    const user = await User.findById(userId) // Assuming you have a User model and Mongoose
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Send back user profile information (make sure you're sending the data you need)
    res.json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
      settings: user.settings,
      tasks: user.tasks
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user profile
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    console.log('User ID:', userId) // Log user ID
    console.log('Request Body:', req.body) // Log request body to check if data is being sent

    const { profilePic, bio, settings } = req.body

    // Validate settings object
    if (settings) {
      if (typeof settings.darkMode !== 'boolean') {
        return res.status(400).json({ message: 'Invalid darkMode flag' })
      }
      if (typeof settings.notifications !== 'boolean') {
        return res.status(400).json({ message: 'Invalid notifications flag' })
      }
    }

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
