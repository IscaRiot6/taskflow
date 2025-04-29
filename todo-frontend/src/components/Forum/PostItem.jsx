import React from 'react';
import '../../styles/forumStyles/PostItem.css';

const PostItem = ({ title, content, votes, onUpvote }) => {
  return (
    <div className="postItem-container">
      <h3 className="postItem-title">{title}</h3>
      <p className="postItem-preview">
        {content.length > 100 ? content.slice(0, 100) + '...' : content}
      </p>
      <div className="postItem-votes">
        <button onClick={onUpvote}>▲ Upvote</button>
        <span>{votes} votes</span>
      </div>
    </div>
  );
};

export default PostItem;
