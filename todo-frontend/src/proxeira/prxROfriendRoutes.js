import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'

const router = express.Router()

// 1. Get all users (excluding self)
router.get('/list', authMiddleware, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.userId } }).select(
    'username email profilePic'
  )
  res.json(users)
})

// 2. Add friend
router.post('/add-friend/:friendId', authMiddleware, async (req, res) => {
  // original edwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
  const user = await User.findById(req.user.userId)
  const { friendId } = req.params

  if (!user.friends.includes(friendId)) {
    user.friends.push(friendId)
    await user.save()
  }

  res.json({ message: 'Friend added' })
})

// 3. Get friend profiles
router.get('/friends', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).populate(
    'friends',
    'username email profilePic'
  )
  res.json(user.friends)
})

export default router
