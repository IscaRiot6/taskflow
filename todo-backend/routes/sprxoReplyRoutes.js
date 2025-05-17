// 2. Get all replies
router.get('/:postId/replies', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId // ✅
    const { page = 1, limit = 10 } = req.query // ✅ pagination entry

    console.log('Fetching replies for post:', req.params.postId)
    console.log('User ID:', req.user?.userId)
    console.log('Page:', page, 'Limit:', limit)

    const allReplies = await Reply.find({ post: req.params.postId })
      .populate('author', 'username profilePic')
      .sort({ createdAt: 1 })

    // First enrich with user vote type
    const enrichedReplies = allReplies.map(reply => {
      const voter = reply.voters.find(v => v.user.toString() === userId)
      return {
        ...reply.toObject(),
        userVoteType: voter ? voter.voteType : null
      }
    })

    // Then build the nested tree
    const nestedReplies = buildReplyTree(enrichedReplies)

    // Optionally: Paginate only top-level replies
    const paginatedReplies = nestedReplies.slice(
      (page - 1) * limit,
      page * limit
    )

    res.status(200).json({
      replies: paginatedReplies,
      currentPage: Number(page),
      totalPages: Math.ceil(nestedReplies.length / limit)
    })
  } catch (err) {
    console.error('Error in GET /:postId/replies:', err)

    res.status(500).json({ message: 'Error fetching replies', error: err })
  }
})
