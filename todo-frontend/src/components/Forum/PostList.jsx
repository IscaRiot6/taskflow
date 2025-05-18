import React, { useState, useEffect, useCallback } from 'react'
import forumApi from '../../api/forumApi'
import '../../styles/forumStyles/PostList.css'
import PostItem from './PostItem'
import ReplyList from './ReplyList'
import { getCurrentUserId } from '../../utils/auth'
import { toast } from 'react-toastify'
import ConfirmDeleteModal from '../ConfirmDeleteModal'
import ForumSpinner from './forumUtils/ForumSpinner'

const PostList = ({ posts, refreshPosts }) => {
  const {
    addReply,
    getRepliesByPostId,
    votePost,
    updatePost,
    deletePost,
    updateReply,
    deleteReply,
    voteReply
  } = forumApi()

  const [activeReplyPostId, setActiveReplyPostId] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [postReplies, setPostReplies] = useState({})
  const [visibleReplies, setVisibleReplies] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [replyToDelete, setReplyToDelete] = useState(null)
  const [showReplyDeleteModal, setShowReplyDeleteModal] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState({})
  const [paginationState, setPaginationState] = useState({})

 const handleReply = (postId) => (parentReplyId, content) => {
  addReply(postId, content, parentReplyId).then(() => {
    refreshReplies(postId)
  })
}



  const handleReplyClick = postId => {
    setActiveReplyPostId(postId)
    setVisibleReplies(prev => ({
      ...prev,
      [postId]: true
    }))
  }

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      console.warn('Reply content is empty.')
      return
    }

    try {
      await addReply(activeReplyPostId, replyContent)
      await fetchReplies(activeReplyPostId)
      setReplyContent('')
      setActiveReplyPostId(null)
    } catch (err) {
      console.error('Failed to submit reply', err)
    }
  }

  // fetchReplies()
  const fetchReplies = async postId => {
    setLoadingReplies(prev => ({ ...prev, [postId]: true }))

    try {
      // const { getRepliesByPostId } = forumApi()

      const data = await getRepliesByPostId(postId, 1, 10)

      setPostReplies(prev => ({
        ...prev,
        [postId]: data.replies // ✅ only replies here
      }))

      setPaginationState(prev => ({
        ...prev,
        [postId]: {
          page: data.currentPage,
          totalPages: data.totalPages,
          totalTopLevelReplies: data.totalTopLevelReplies
        }
      }))
      console.log(`Updated pagination state for ${postId}:`, {
        page: data.currentPage,
        totalPages: data.totalPages,
        
      })
    } catch (err) {
      console.log('paginationState (fetchReplies)', paginationState[postId])
      console.error('Failed to fetch replies:', err)
    } finally {
      setLoadingReplies(prev => ({ ...prev, [postId]: false }))
    }
  }

  useEffect(() => {
    const fetchAllReplies = async () => {
      for (const post of posts) {
        await fetchReplies(post._id)
      }
    }

    if (posts.length) fetchAllReplies()
  }, [posts])

  const toggleReplies = postId => {
    setVisibleReplies(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  // loadMoreReplies()
  const loadMoreReplies = async postId => {
    const current = paginationState[postId] || { page: 1, totalPages: 1 }
    if (current.page >= current.totalPages) return

    setLoadingReplies(prev => ({ ...prev, [postId]: true }))

    try {
      const data = await getRepliesByPostId(postId, current.page + 1, 10)

      setPostReplies(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), ...data.replies]
      }))

      setPaginationState(prev => ({
        ...prev,
        [postId]: {
          page: current.page + 1,
          totalPages: data.totalPages,
          totalTopLevelReplies: data.totalTopLevelReplies
        }
      }))
    } catch (error) {
      console.log(
        `Loading more replies for ${postId}: page ${current.page + 1} of ${
          current.totalPages
        }`
      )

      console.error('Error loading more replies:', error)
    } finally {
      setLoadingReplies(prev => ({ ...prev, [postId]: false }))
    }
  }

  const showLoadMoreButton = postId => {
    const pageData = paginationState[postId]
    console.log('Should Show Load More?', {
      postId,
      pageData,
      condition: pageData && pageData.page < pageData.totalPages
    })
    return pageData && pageData.page < pageData.totalPages
  }

  const handleVote = async (postId, voteType) => {
    try {
      const updatedPost = await votePost(postId, voteType)
      refreshPosts()
    } catch (err) {
      console.error(`Failed to ${voteType}vote post:`, err)
    }
  }

  const handleEdit = async (postId, updatedData) => {
    try {
      await updatePost(postId, updatedData)
      toast.success('Post updated successfully!')
      refreshPosts()
    } catch (err) {
      toast.error('Failed to update post.')
      console.error('Failed to update post:', err)
    }
  }

  const handleDeleteClick = postId => {
    setPostToDelete(postId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deletePost(postToDelete)
      toast.success('Post deleted successfully!')
      refreshPosts()
    } catch (err) {
      toast.error('Failed to delete post.')
      console.error('Failed to delete post:', err)
    } finally {
      setShowDeleteModal(false)
      setPostToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setPostToDelete(null)
  }

  const handleEditReply = async (postId, replyId, updatedData) => {
    try {
      await updateReply(replyId, updatedData)
      toast.success('Reply updated successfully!')
      await fetchReplies(postId) // Refresh replies
    } catch (error) {
      toast.error('Failed to update reply.')
      console.error('Failed to edit reply:', error)
    }
  }

  const handleDeleteReply = async (postId, replyId) => {
    try {
      await deleteReply(replyId)
      toast.success('Reply deleted successfully!')
      await fetchReplies(postId) // Refresh replies for the post
    } catch (error) {
      toast.error('Failed to delete reply.')
      console.error('Failed to delete reply:', error)
    }
  }

  const updateNestedReplyVotes = (replies, replyId, updatedVotes, voteType) => {
    return replies.map(reply => {
      if (reply._id === replyId) {
        let newUserVoteType = reply.userVoteType === voteType ? null : voteType
        return {
          ...reply,
          votes: updatedVotes,
          userVoteType: newUserVoteType
        }
      }
      if (reply.children && reply.children.length > 0) {
        return {
          ...reply,
          children: updateNestedReplyVotes(
            reply.children,
            replyId,
            updatedVotes,
            voteType
          )
        }
      }
      return reply
    })
  }

  const handleVoteReply = async (replyId, voteType, postId) => {
    try {
      const response = await voteReply(replyId, voteType)

      setPostReplies(prevReplies => {
        const updatedReplies = { ...prevReplies }
        updatedReplies[postId] = updateNestedReplyVotes(
          updatedReplies[postId],
          replyId,
          response.votes,
          voteType
        )
        return updatedReplies
      })
    } catch (error) {
      console.error('Error voting on reply:', error)
    }
  }

  const handleConfirmDeleteReply = async () => {
    try {
      await deleteReply(replyToDelete.replyId)
      toast.success('Reply deleted successfully!')
      refreshPosts() // Or reload replies if more granular
    } catch (err) {
      toast.error('Failed to delete reply.')
      console.error('Failed to delete reply:', err)
    } finally {
      setShowReplyDeleteModal(false)
      setReplyToDelete(null)
    }
  }

  const handleCancelDeleteReply = () => {
    setShowReplyDeleteModal(false)
    setReplyToDelete(null)
  }

  // const getRemainingReplies = postId => {
  // const { page, totalPages } = paginationState[postId] || {}
  // const repliesLoaded = page * 10
  // const totalTopLevelReplies = totalPages * 10
  // const remaining = totalTopLevelReplies - repliesLoaded
  // return Math.max(remaining, 0)
  // }

  const getRemainingReplies = postId => {
  const pageData = paginationState[postId]
  if (!pageData) return 0

  const repliesLoaded = pageData.page * 10
  const remaining = pageData.totalTopLevelReplies - repliesLoaded
  return Math.max(remaining, 0)
  }



  // refreshReplies()
  const refreshReplies = postId => {
   getRepliesByPostId(postId)
      .then(data => {
        setPostReplies(prev => ({ ...prev, [postId]: data.replies }))
        setPaginationState(prev => ({
          ...prev,
          [postId]: {
            page: data.currentPage,
            totalPages: data.totalPages,
            totalTopLevelReplies: data.totalTopLevelReplies
          }
        }))
      })
  }

  if (posts.length === 0) return <p className='postList-empty'>No posts yet.</p>

  return (
    <div className='postList-container'>
      {posts.map(post => (
        <div key={post._id}>
          <PostItem
            postId={post._id}
            title={post.title}
            content={post.content}
            votes={post.votes}
            createdAt={post.createdAt}
            tags={post.tags}
            onVote={type => handleVote(post._id, type)}
            userVoteType={post.userVoteType}
            authorUsername={post.author?.username}
            authorProfilePic={post.author?.profilePic}
            onEdit={handleEdit}
            onDelete={() => {
              setPostToDelete(post._id)
              setShowDeleteModal(true)
            }}
            isAuthor={post.author?._id === getCurrentUserId()}
          />

          <div className='post-actions'>
            <button onClick={() => handleReplyClick(post._id)}>Reply</button>
            <button onClick={() => toggleReplies(post._id)}>
              {visibleReplies[post._id] ? 'Hide Replies' : 'Show Replies'} (
              {postReplies[post._id]?.length || 0})
            </button>
          </div>

          {activeReplyPostId === post._id && (
            <div className='reply-form'>
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder='Write your reply...'
              />
              <button onClick={handleReplySubmit}>Submit Reply</button>
              <button onClick={() => setActiveReplyPostId(null)}>Cancel</button>
            </div>
          )}

          {visibleReplies[post._id] && (
            <>
              <ReplyList
                postId={post._id}
                replies={postReplies[post._id] || []}
                loading={loadingReplies[post._id]}
                onVote={handleVoteReply}
                onEdit={(replyId, updatedData) =>
                  handleEditReply(post._id, replyId, updatedData)
                }
                onDelete={(postId, replyId) => {
                  setReplyToDelete({ postId, replyId })
                  setShowReplyDeleteModal(true)
                }}
                currentUserId={getCurrentUserId()}
                onReply={handleReply(post._id)}

              />

              {loadingReplies[post._id] && <ForumSpinner />}

              {!loadingReplies[post._id] && showLoadMoreButton(post._id) && (
                <button
                  onClick={() => loadMoreReplies(post._id)}
                  disabled={loadingReplies[post._id]}
                >
                  Load more replies ({getRemainingReplies(post._id)} remaining)
                </button>

              )}

            </>
          )}
        </div>
      ))}

      {showDeleteModal && (
        <ConfirmDeleteModal
          message='Are you sure you want to delete this post?'
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {showReplyDeleteModal && (
        <ConfirmDeleteModal
          message='Are you sure you want to delete this reply?'
          onConfirm={handleConfirmDeleteReply}
          onCancel={handleCancelDeleteReply}
        />
      )}
    </div>
  )
}

export default PostList
