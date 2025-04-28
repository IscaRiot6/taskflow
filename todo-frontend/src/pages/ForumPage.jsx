import React from 'react';
import CreatePost from '.././components/Forum/CreatePost'
import PostList from '../components/Forum/PostList';
import '../styles/forumStyles/forumPage.css'


const ForumPage = () => {
    return (
      <div className="forumPage-wrapper">
        <h1 className="forumPage-title">Forum</h1>
        <div className="forumPage-content">
          <CreatePost />
          <PostList /> 
        </div>
      </div>
    );
  };

export default ForumPage;
