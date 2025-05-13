const forumApi = () => {
  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'

  // 1. Create a new post
  const createPost = async (title, content, tags) => {
    try {
      const response = await fetch(`${API_URL}/api/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ title, content, tags })
      })

      if (!response.ok) {
        throw new Error(`Failed to create post. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // 2.  Get all posts
  const getAllPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/forum/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch posts. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  // 3. Update a post
  const updatePost = async (postId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/api/forum/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error(`Failed to update post. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  // 4. Delete a post
  const deletePost = async postId => {
    try {
      const response = await fetch(`${API_URL}/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete post. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  // 5.  Add a reply to a post
  const addReply = async (postId, content, parentReplyId = null) => {
    try {
      const response = await fetch(
        `${API_URL}/api/forum/replies/${postId}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ content, parentReplyId })
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to add reply. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error adding reply:', error)
      throw error
    }
  }

  // 6. Get all replies
  const getRepliesByPostId = async postId => {
    try {
      const response = await fetch(
        `${API_URL}/api/forum/replies/${postId}/replies`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch replies')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching replies:', error)
      throw error
    }
  }

  // 7. Vote
  const votePost = async (postId, voteType) => {
    try {
      const response = await fetch(
        `${API_URL}/api/forum/posts/${postId}/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ voteType })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to vote on post')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error voting on post:', error)
      throw error
    }
  }

  // 8. Update a reply
  const updateReply = async (replyId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/api/forum/replies/${replyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error(`Failed to update reply. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating reply:', error)
      throw error
    }
  }

  // 9. Delete a reply
  const deleteReply = async replyId => {
    try {
      const response = await fetch(`${API_URL}/api/forum/replies/${replyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete reply. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting reply:', error)
      throw error
    }
  }

  // 10.  Vote on a reply
  const voteReply = async (replyId, voteType) => {
    try {
      const response = await fetch(
        `${API_URL}/api/forum/replies/${replyId}/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ voteType })
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to vote on reply. Status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error voting on reply:', error)
      throw error
    }
  }

  // Return all the API functions
  return {
    createPost,
    getAllPosts,
    addReply,
    getRepliesByPostId,
    votePost,
    updatePost,
    deletePost,
    updateReply,
    deleteReply,
    voteReply
  }
}

export default forumApi
