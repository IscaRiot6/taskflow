import express from 'express'
import Message from '../models/messageModel.js'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'

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
