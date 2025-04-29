import express from 'express'
import Post from '../models/postModel.js'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/userModel.js' // Import the User model

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { title, content, tags } = req.body

    // Handle tags being either a string or an array
    let tagArray = []
    if (Array.isArray(tags)) {
      tagArray = tags.map(tag => tag.trim())
    } else if (typeof tags === 'string') {
      tagArray = tags.split(',').map(tag => tag.trim())
    }

    const newPost = new Post({
      title,
      content,
      tags: tagArray,
      authorId: user.id,
      authorUsername: user.username
    })

    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error })
  }
})

// Get all posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sortBy } = req.query

    let sortOption = { createdAt: -1 } // default: newest first
    if (sortBy === 'votes') sortOption = { votes: -1 }
    else if (sortBy === 'replies') sortOption = { 'replies.length': -1 }

    const posts = await Post.find().sort(sortOption)
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error })
  }
})

// Add a reply to a post
router.post('/:postId/reply', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { content } = req.body
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.replies.push({
      content,
      authorId: user.id,
      authorUsername: user.username
    })

    await post.save()
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply', error })
  }
})

// Get all replies
router.get('/:postId/replies', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post.replies) // ✅ send the replies array
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch replies', error })
  }
})

// Upvote or downvote a post
router.post('/:postId/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body // 'up' or 'down'
    const userId = req.user.userId

    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const existingVoteIndex = post.voters.findIndex(
      voter => voter.user.toString() === userId
    )

    // check if user has already voted
    if (existingVoteIndex !== -1) {
      const existingVote = post.voters[existingVoteIndex]
      if (existingVote.voteType === voteType) {
        return res
          .status(400)
          .json({ message: 'You have already voted this way.' })
      } else {
        // Change vote
        post.votes += voteType === 'up' ? 2 : -2
        post.voters[existingVoteIndex].voteType = voteType
      }
    } else {
      // New vote
      post.votes += voteType === 'up' ? 1 : -1
      post.voters.push({ user: userId, voteType })
    }

    await post.save()
    res.status(200).json({ message: 'Vote registered', votes: post.votes })
  } catch (error) {
    res.status(500).json({ message: 'Error voting on post', error })
  }
})

export default router
