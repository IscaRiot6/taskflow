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

// 2. Send friend request
// POST /api/friends/request/:friendId
router.post('/send-request/:friendId', authMiddleware, async (req, res) => {
  const userId = req.user.userId
  const friendId = req.params.friendId

  if (userId === friendId)
    return res.status(400).json({ message: "You can't add yourself." })

  const user = await User.findById(userId)
  const friend = await User.findById(friendId)

  if (
    user.friends.includes(friendId) ||
    user.friendRequestsSent.includes(friendId)
  ) {
    return res.status(400).json({ message: 'Already friends or request sent' })
  }

  user.friendRequestsSent.push(friendId)
  friend.friendRequestsReceived.push(userId)

  await user.save()
  await friend.save()

  res.json({ message: 'Friend request sent' })
})

// 3. Accept friend request
// POST /api/friends/accept/:friendId
router.post('/accept-request/:friendId', authMiddleware, async (req, res) => {
  const userId = req.user.userId
  const friendId = req.params.friendId

  const user = await User.findById(userId)
  const friend = await User.findById(friendId)

  if (!user.friendRequestsReceived.includes(friendId)) {
    return res.status(400).json({ message: 'No request from this user' })
  }

  // Add to friends list
  user.friends.push(friendId)
  friend.friends.push(userId)

  // Remove from pending requests
  user.friendRequestsReceived = user.friendRequestsReceived.filter(
    id => id.toString() !== friendId
  )
  friend.friendRequestsSent = friend.friendRequestsSent.filter(
    id => id.toString() !== userId
  )

  await user.save()
  await friend.save()

  res.json({ message: 'Friend request accepted' })
})

// 4. Reject friend request/ Cancel
// POST /api/friends/reject-request/:friendId
router.post('/reject-request/:friendId', authMiddleware, async (req, res) => {
  const userId = req.user.userId
  const friendId = req.params.friendId

  const user = await User.findById(userId)
  const friend = await User.findById(friendId)

  user.friendRequestsReceived = user.friendRequestsReceived.filter(
    id => id.toString() !== friendId
  )
  friend.friendRequestsSent = friend.friendRequestsSent.filter(
    id => id.toString() !== userId
  )

  await user.save()
  await friend.save()

  res.json({ message: 'Friend request rejected' })
})

// 5. Get friend profiles
router.get('/friends', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).populate(
    'friends',
    'username email profilePic'
  )
  res.json(user.friends)
})

// 6. Remove friend
// DELETE /api/friends/remove/:friendId
router.delete('/remove-friend/:friendId', authMiddleware, async (req, res) => {
  const userId = req.user.userId
  const friendId = req.params.friendId

  const user = await User.findById(userId)
  const friend = await User.findById(friendId)

  if (!user || !friend) {
    return res.status(404).json({ message: 'User or friend not found' })
  }

  user.friends = user.friends.filter(id => id.toString() !== friendId)
  friend.friends = friend.friends.filter(id => id.toString() !== userId)

  await user.save()
  await friend.save()

  res.json({ message: 'Friend removed' })
})

// 7. Get sent requests
// GET /api/friends/pending/sent
router.get('/pending/sent', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).populate(
    'friendRequestsSent',
    'username email profilePic'
  )
  res.json(user.friendRequestsSent)
})

// 8. Get Received Requests
// GET /api/friends/pending/received
router.get('/pending/received', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).populate(
    'friendRequestsReceived',
    'username email profilePic'
  )
  res.json(user.friendRequestsReceived)
})

// 9. Get mutual friends
// GET /api/friends/mutual/:otherUserId
router.get('/mutual/:otherUserId', authMiddleware, async (req, res) => {
  const userId = req.user.userId
  const otherUserId = req.params.otherUserId

  try {
    const user = await User.findById(userId).select('friends')
    const otherUser = await User.findById(otherUserId).select('friends')

    const mutualIds = user.friends.filter(id => otherUser.friends.includes(id))

    const mutualFriends = await User.find({ _id: { $in: mutualIds } }).select(
      'username profilePic'
    )

    res.json(mutualFriends)
  } catch (err) {
    console.error('Error fetching mutual friends:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
