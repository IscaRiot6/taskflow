import express from 'express'
import Post from '../../models/postModel.js'
import Reply from '../../models/replyModel.js'
const router = express.Router()
import authMiddleware from '../../middleware/authMiddleware.js'
import User from '../../models/userModel.js'
import buildReplyTree from '../../utils/buildReplyTree.js'

// 1. Add a reply to a post
router.post('/:postId/reply', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { content, parentReplyId } = req.body
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const reply = new Reply({
      content,
      author: user._id,
      post: post._id,
      parentReply: parentReplyId || null
    })

    await reply.save()
    res.status(201).json(reply)
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply', error })
  }
})

// 2. Get all replies
router.get('/:postId/replies', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId // ✅ Fix added here

    const replies = await Reply.find({ post: req.params.postId })
      .populate('author', 'username profilePic')
      .sort({ createdAt: 1 })

    // First enrich with user vote type
    const enrichedReplies = replies.map(reply => {
      const voter = reply.voters.find(v => v.user.toString() === userId)
      return {
        ...reply.toObject(),
        userVoteType: voter ? voter.voteType : null
      }
    })

    // Then build the nested tree
    const nestedReplies = buildReplyTree(enrichedReplies)

    res.status(200).json(nestedReplies)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching replies', error: err })
  }
})

// 3. Update a reply
router.put('/:replyId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body
    const userId = req.user.userId

    const reply = await Reply.findById(req.params.replyId)
    if (!reply) return res.status(404).json({ message: 'Reply not found' })

    if (reply.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to edit this reply' })
    }

    reply.content = content || reply.content
    await reply.save()

    res.status(200).json({ message: 'Reply updated successfully', reply })
  } catch (error) {
    res.status(500).json({ message: 'Error updating reply', error })
  }
})

// 4. Delete a reply
router.delete('/:replyId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId

    const reply = await Reply.findById(req.params.replyId)
    if (!reply) return res.status(404).json({ message: 'Reply not found' })

    if (reply.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this reply' })
    }

    await Reply.findByIdAndDelete(req.params.replyId)
    res.status(200).json({ message: 'Reply deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reply', error })
  }
})

// 5. Vote on a reply
router.post('/:replyId/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body // 'up' or 'down'
    const userId = req.user.userId

    const reply = await Reply.findById(req.params.replyId)
    if (!reply) return res.status(404).json({ message: 'Reply not found' })

    const existingVoteIndex = reply.voters.findIndex(
      voter => voter.user.toString() === userId
    )

    if (existingVoteIndex !== -1) {
      const existingVote = reply.voters[existingVoteIndex]
      if (existingVote.voteType === voteType) {
        // User is retracting their vote
        reply.votes += voteType === 'up' ? -1 : 1
        reply.voters.splice(existingVoteIndex, 1)
      } else {
        // User is switching vote direction
        reply.votes += voteType === 'up' ? 2 : -2
        reply.voters[existingVoteIndex].voteType = voteType
      }
    } else {
      // New vote
      reply.votes += voteType === 'up' ? 1 : -1
      reply.voters.push({ user: userId, voteType })
    }

    await reply.save()
    res.status(200).json({
      message: 'Vote registered',
      votes: reply.votes
      // userVoteType: null
    })
  } catch (error) {
    res.status(500).json({ message: 'Error voting on reply', error })
  }
})

export default router
