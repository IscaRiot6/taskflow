import React, { useState, useEffect } from 'react';
import forumApi from '../../api/forumApi';
import '../../styles/forumStyles/PostList.css';
import PostItem from './PostItem';
import ReplyList from './ReplyList';
import { getCurrentUserId } from '../../utils/auth';
import { toast } from 'react-toastify';
import ConfirmDeleteModal from '../ConfirmDeleteModal';


const PostList = ({ posts, refreshPosts }) => {
  const { addReply, votePost, updatePost, deletePost } = forumApi();

  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [postReplies, setPostReplies] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  

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

  const handleVote = async (postId, voteType) => {
    try {
      const updatedPost = await votePost(postId, voteType);
      refreshPosts();
    } catch (err) {
      console.error(`Failed to ${voteType}vote post:`, err);
    }
  };

  const handleEdit = async (postId, updatedData) => {
    try {
      await updatePost(postId, updatedData);
      toast.success('Post updated successfully!');
      refreshPosts();
    } catch (err) {
      toast.error('Failed to update post.');
      console.error('Failed to update post:', err);
    }
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deletePost(postToDelete);
      toast.success('Post deleted successfully!');
      refreshPosts();
    } catch (err) {
      toast.error('Failed to delete post.');
      console.error('Failed to delete post:', err);
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };
  
  
  
  

  if (posts.length === 0) return <p className="postList-empty">No posts yet.</p>;

  return (
    <div className="postList-container">
      {posts.map((post) => (
        <div key={post._id}>
          <PostItem
            postId={post._id}
            title={post.title}
            content={post.content}
            votes={post.votes}
            createdAt={post.createdAt}
            tags={post.tags}
            onVote={(type) => handleVote(post._id, type)}
            userVoteType={post.userVoteType}
            authorUsername={post.author?.username}
            authorProfilePic={post.author?.profilePic}
            onEdit={handleEdit}
            onDelete={() => {
              setPostToDelete(post._id);
              setShowDeleteModal(true);
            }}
            isAuthor={post.author?._id === getCurrentUserId()}
          />
          {/* <ConfirmDeleteModal
  show={showDeleteModal}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/> */}
          

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
      {showDeleteModal && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this post?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default PostList;
