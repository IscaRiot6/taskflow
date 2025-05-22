import React, { useState, useEffect } from 'react';
import forumApi from '../api/forumApi';
import CreatePost from '../components/Forum/CreatePost';
import PostList from '../components/Forum/PostList';
import '../styles/forumStyles/ForumPage.css';
//  import 'bootstrap/dist/css/bootstrap.min.css'
import Pagination from '../components/Pagination'

const ForumPage = () => {
  const { getAllPosts } = forumApi();
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5 // Adjust 
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

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)


  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (

    
    <div className="forumPage-wrapper">
      <h1 className="forumPage-title">Forum</h1>
      <p className="forumPage-welcome">
        Here you can post whatever you want — just avoid offensive language! 🙂
      </p>
      <div className="forumPage-content">
        <CreatePost refreshPosts={refreshPosts} />  

        {/* <PostList posts={currentPosts} refreshPosts={refreshPosts} /> */}
        <div className="forumPage-posts-fade">
          <PostList posts={currentPosts} refreshPosts={refreshPosts} />
        </div>

        <Pagination
          tasks={posts}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          tasksPerPage={postsPerPage}
        />
        
      </div>
    </div>
  );
};

export default ForumPage;
