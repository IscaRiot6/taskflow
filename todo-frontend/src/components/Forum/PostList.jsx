import React, { useState, useEffect } from 'react';
import forumApi from '../../api/forumApi';
import '../../styles/forumStyles/PostList.css'; 
import PostItem from './PostItem';
import ReplyList from './ReplyList';

const PostList = () => {
  const { getAllPosts } = forumApi();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    console.log(`Reply clicked for post ${postId}`);
    // Here you can implement the reply logic when it becomes active
  };

  const handleLikeClick = (postId) => {
    console.log(`Like clicked for post ${postId}`);
    // Implement 'like' functionality here
  };

  const handleReactClick = (postId) => {
    console.log(`React clicked for post ${postId}`);
    // Implement 'react' functionality here
  };

  if (loading) return <p className="postList-loading">Loading posts...</p>;
  if (error) return <p className="postList-error">{error}</p>;
  if (posts.length === 0) return <p className="postList-empty">No posts yet.</p>;

  return (
    <div className="postList-container">
      {posts.map((post) => (
        <div key={post._id}>
          <PostItem title={post.title} content={post.content} />
          <div className="post-actions">
            <button onClick={() => handleReplyClick(post._id)}>Reply</button>
            <button onClick={() => handleLikeClick(post._id)}>Like</button>
            <button onClick={() => handleReactClick(post._id)}>React</button>
          </div>
          <ReplyList postId={post._id} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
