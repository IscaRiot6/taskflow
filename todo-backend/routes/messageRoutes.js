import express from 'express'
import Message from '../models/messageModel.js'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'
import mongoose from 'mongoose'

// GET /api/messages/unseen/:userId
router.get('/unseen/:userId', authMiddleware, async (req, res) => {
  console.log('🔥 ROUTE HIT: /unseen/:userId')
  try {
    const { userId } = req.params
    console.log('🆔 userId:', userId)

    const isValid = mongoose.Types.ObjectId.isValid(userId)
    console.log('✅ isValid ObjectId:', isValid)

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    const user = await User.findById(userId)
    console.log('🔍 user:', user ? user.username : 'not found')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Fetch unseen messages where the recipient is the current user
    const unseenMessages = await Message.aggregate([
      { $match: { to: new mongoose.Types.ObjectId(userId), seen: false } },
      {
        $group: {
          _id: '$from',
          count: { $sum: 1 }
        }
      }
    ])

    console.log('✅ Unseen messages:', unseenMessages)

    res.json(unseenMessages)
  } catch (error) {
    console.error('❌ Route failed with error:')
    console.error(error)
    res.status(500).json({ error: error.message || 'Internal error' })
  }
})

router.get('/:user1/:user2', authMiddleware, async (req, res) => {
  const { user1, user2 } = req.params
  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    }).sort({ timestamp: 1 })

    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// PATCH /api/messages/mark-seen
router.patch('/mark-seen', authMiddleware, async (req, res) => {
  const { from, to } = req.body

  try {
    const result = await Message.updateMany(
      { from, to, seen: false },
      { $set: { seen: true } }
    )
    res.json({ updated: result.modifiedCount })
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark messages as seen' })
  }
})

export default router
