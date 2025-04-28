import React from 'react';
import '../../styles/forumStyles/PostItem.css'; // Light CSS for PostItem

const PostItem = ({ title, content }) => {
  return (
    <div className="postItem-container">
      <h3 className="postItem-title">{title}</h3>
      <p className="postItem-preview">
        {content.length > 100 ? content.slice(0, 100) + '...' : content}
      </p>
    </div>
  );
};

export default PostItem;
