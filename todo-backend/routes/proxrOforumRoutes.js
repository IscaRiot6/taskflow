import express from 'express'
import Post from '../models/postModel.js'
import Reply from '../models/replyModel.js'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'

// 1. Create a new post
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
      author: user._id
    })

    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error })
  }
})

// 2. Get all posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sortBy } = req.query
    const userId = req.user.userId

    let sortOption = { createdAt: -1 } // default: newest first
    if (sortBy === 'votes') sortOption = { votes: -1 }
    else if (sortBy === 'replies') sortOption = { 'replies.length': -1 }

    const posts = await Post.find()
      .sort(sortOption)
      .populate('author', 'username profilePic')

    const postsWithUserVote = posts.map(post => {
      const userVote = post.voters.find(
        voter => voter.user.toString() === userId
      )
      return {
        ...post.toObject(),
        userVoteType: userVote ? userVote.voteType : null
      }
    })

    res.status(200).json(postsWithUserVote)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error })
  }
})

// 3.  Update a post
router.put('/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const { title, content, tags } = req.body
    const userId = req.user.userId

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    // Check if the current user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to edit this post' })
    }

    // Update fields
    if (title) post.title = title
    if (content) post.content = content
    if (tags) {
      post.tags = Array.isArray(tags)
        ? tags.map(tag => tag.trim())
        : tags.split(',').map(tag => tag.trim())
    }

    await post.save()
    res.status(200).json({ message: 'Post updated successfully', post })
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error })
  }
})

// 4. Delete a post
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.user.userId

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    // Check if the current user is the author
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this post' })
    }

    await Post.findByIdAndDelete(postId)
    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error })
  }
})

// 5. Upvote or downvote a post
router.post('/:postId/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body // 'up' or 'down'
    const userId = req.user.userId

    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const existingVoteIndex = post.voters.findIndex(
      voter => voter.user.toString() === userId
    )

    if (existingVoteIndex !== -1) {
      const existingVote = post.voters[existingVoteIndex]
      if (existingVote.voteType === voteType) {
        // User is retracting their vote
        post.votes += voteType === 'up' ? -1 : 1
        post.voters.splice(existingVoteIndex, 1)
      } else {
        // User is switching vote direction
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

// 6. Add a reply to a post
router.post('/:postId/reply', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const reply = new Reply({
      content,
      author: req.user.userId,
      post: post._id
    })

    await reply.save()
    res.status(201).json(reply)
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply', error })
  }
})

// 7. Get all replies
router.get('/:postId/replies', authMiddleware, async (req, res) => {
  try {
    const replies = await Reply.find({ post: req.params.postId })
      .populate('author', 'username profilePic')
      .sort({ createdAt: 1 })

    res.json(replies)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch replies', error })
  }
})

// 8. Update a reply
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

// 9. Delete a reply
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

// 10.  Vote on a reply
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
    res.status(200).json({ message: 'Vote registered', votes: reply.votes })
  } catch (error) {
    res.status(500).json({ message: 'Error voting on reply', error })
  }
})

export default router
