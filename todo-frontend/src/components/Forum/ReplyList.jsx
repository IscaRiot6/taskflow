import React from 'react';
import ReplyItem from './ReplyItem';
// import '../../styles/forumStyles/ReplyList.css';

const ReplyList = ({ replies }) => {
  if (!replies) return <p>Loading replies...</p>;

  return (
    <div className="replyList-container">
      {replies.length > 0 ? (
        replies.map((reply) => (
          <ReplyItem key={reply._id} author={reply.author} content={reply.content} />
        ))
      ) : (
        <p>No replies yet.</p>
      )}
    </div>
  );
};

export default ReplyList;
