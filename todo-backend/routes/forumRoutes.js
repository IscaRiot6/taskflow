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

    const { title, content } = req.body
    const newPost = new Post({
      title,
      content,
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
    const posts = await Post.find().sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error })
  }
})

// Add a reply to a post
router.post('/:postId/reply', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId) // <-- corrected here
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

// In your Express route file (e.g., routes/forumRoutes.js)
router.get('/:postId/replies', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId
    const replies = await Reply.find({ postId }) // assuming Reply is the model for replies
    res.json(replies)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch replies', error })
  }
})

export default router
