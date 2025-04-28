import React from 'react';
// import '../../styles/forumStyles/ReplyItem.css';

const ReplyItem = ({ author, content }) => {
  return (
    <div className="replyItem-container">
      <p className="replyItem-content">{content}</p>
      {author && <span className="replyItem-author">- {author}</span>}
    </div>
  );
};

export default ReplyItem;
