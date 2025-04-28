import React, { useState, useEffect } from 'react';
import forumApi from '../../api/forumApi';
import '../../styles/forumStyles/PostList.css'; // Light CSS

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

  if (loading) return <p className="postList-loading">Loading posts...</p>;
  if (error) return <p className="postList-error">{error}</p>;
  if (posts.length === 0) return <p className="postList-empty">No posts yet.</p>;

  return (
    <div className="postList-container">
      {posts.map((post) => (
        <div key={post._id} className="postList-item">
          <h3 className="postList-title">{post.title}</h3>
          <p className="postList-preview">
            {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
