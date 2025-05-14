import React from 'react';
import ReplyItem from './ReplyItem';
import '../../styles/forumStyles/ReplyList.css';

const ReplyList = ({ postId, replies, onVote, onEdit, onDelete, currentUserId, onReply, depth = 0 }) => {
  if (!replies) return <p>Loading replies...</p>;

  return (
    <div className={`replyList-container depth-${depth}`}>
      {replies.length > 0 ? (
        replies.map((reply) => (
          <div key={reply._id} className="reply-with-children">
            <ReplyItem
              replyId={reply._id}
              content={reply.content}
              createdAt={reply.createdAt}
              authorUsername={reply.author?.username}
              authorProfilePic={reply.author?.profilePic}
              votes={reply.votes}
              userVoteType={reply.userVoteType}
              onVote={(type) => onVote(reply._id, type, postId)}
              onEdit={onEdit}
              onDelete={() => onDelete(postId, reply._id)} 
              isAuthor={reply.author?._id === currentUserId}
              onReply={onReply} // ✅ 
            />

            {/* 🔁 Recursive render of children replies */}
            {reply.children && reply.children.length > 0 && (
              <ReplyList
                postId={postId}
                replies={reply.children}
                onVote={onVote}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserId={currentUserId}
                onReply={onReply} // ✅ 
                depth={depth + 1}
              />
            )}
          </div>
        ))
      ) : (
        <p>No replies yet.</p>
      )}
    </div>
  );
};

export default ReplyList;
