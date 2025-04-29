import React, { useState, useEffect } from 'react';
import forumApi from '../api/forumApi';
import CreatePost from '../components/Forum/CreatePost';
import PostList from '../components/Forum/PostList';
import '../styles/forumStyles/forumPage.css';
//  import 'bootstrap/dist/css/bootstrap.min.css'

const ForumPage = () => {
  const { getAllPosts } = forumApi();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchPosts();
  }, []); // Initial fetch when component loads

  const refreshPosts = async () => {
    setLoading(true); // Manually trigger loading state
    await fetchPosts(); // Re-fetch posts
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="forumPage-wrapper">
      <h1 className="forumPage-title">Forum</h1>
      <div className="forumPage-content">
        <CreatePost refreshPosts={refreshPosts} />  
        <PostList posts={posts} />
      </div>
    </div>
  );
};

export default ForumPage;
