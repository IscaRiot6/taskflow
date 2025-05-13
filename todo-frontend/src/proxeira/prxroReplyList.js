import React from 'react'
import ReplyItem from './ReplyItem'
import '../../styles/forumStyles/ReplyList.css'

const ReplyList = ({
  postId,
  replies,
  onVote,
  onEdit,
  onDelete,
  currentUserId
}) => {
  if (!replies) return <p>Loading replies...</p>

  return (
    <div className='replyList-container'>
      {replies.length > 0 ? (
        replies.map(reply => (
          <ReplyItem
            key={reply._id}
            replyId={reply._id}
            content={reply.content}
            createdAt={reply.createdAt}
            authorUsername={reply.author?.username}
            authorProfilePic={reply.author?.profilePic}
            votes={reply.votes}
            userVoteType={reply.userVoteType}
            onVote={type => onVote(reply._id, type, postId)}
            onEdit={onEdit}
            onDelete={() => onDelete(postId, reply._id)}
            isAuthor={reply.author?._id === currentUserId}
          />
        ))
      ) : (
        <p>No replies yet.</p>
      )}
    </div>
  )
}

export default ReplyList
