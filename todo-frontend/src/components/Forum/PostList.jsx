import React, { useState, useEffect } from 'react';
import forumApi from '../../api/forumApi';
import '../../styles/forumStyles/PostList.css'; 
import PostItem from './PostItem';
import ReplyList from './ReplyList';

const PostList = () => {
  const { getAllPosts , addReply , votePost } = forumApi();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [postReplies, setPostReplies] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);



  const handleReplyClick = (postId) => {
    setActiveReplyPostId(postId);
    setVisibleReplies((prev) => ({
      ...prev,
      [postId]: true
    }));
  };
  

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      console.warn('Reply content is empty.');
      return;
    }
  
    try {
      await addReply(activeReplyPostId, replyContent);
      await fetchReplies(activeReplyPostId);
      setReplyContent('');
      setActiveReplyPostId(null);
    } catch (err) {
      console.error('Failed to submit reply', err);
    }
  };

  const fetchReplies = async (postId) => {
    try {
      const { getRepliesByPostId } = forumApi();
      const data = await getRepliesByPostId(postId);
      setPostReplies((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error('Failed to fetch replies:', err);
    }
  };

  useEffect(() => {
    const fetchAllReplies = async () => {
      for (const post of posts) {
        await fetchReplies(post._id);
      }
    };

    if (posts.length) fetchAllReplies();
  }, [posts]);
  
  
  const toggleReplies = (postId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  
  
  
  const handleUpvote = async (postId) => {
    try {
      const updatedPost = await votePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, votes: updatedPost.votes } : post
        )
      );
    } catch (err) {
      console.error('Failed to upvote post:', err);
    }
  };

  if (loading) return <p className="postList-loading">Loading posts...</p>;
  if (error) return <p className="postList-error">{error}</p>;
  if (posts.length === 0) return <p className="postList-empty">No posts yet.</p>;

  return (
    <div className="postList-container">
    {posts.map((post) => (
      <div key={post._id}>
        <PostItem
          title={post.title}
          content={post.content}
          votes={post.votes}
          onUpvote={() => handleUpvote(post._id)}
        />
        <div className="post-actions">
          <button onClick={() => handleReplyClick(post._id)}>Reply</button>
          <button onClick={() => toggleReplies(post._id)}>
            {visibleReplies[post._id] ? 'Hide Replies' : 'Show Replies'} ({postReplies[post._id]?.length || 0})
          </button>
        </div>

  
        {activeReplyPostId === post._id && (
            <div className="reply-form">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
              />
              <button onClick={handleReplySubmit}>Submit Reply</button>
              <button onClick={() => setActiveReplyPostId(null)}>Cancel</button>
            </div>
          )}

{visibleReplies[post._id] && (
  <ReplyList postId={post._id} replies={postReplies[post._id] || []} />
)}

        </div>
      ))}
    </div>
  );
  
};

export default PostList;
