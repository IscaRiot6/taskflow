import React, { useState } from 'react'
import '../../styles/forumStyles/ReplyItem.css'
import { formatDistanceToNow } from 'date-fns'

const ReplyItem = ({
  replyId,
  content,
  createdAt,
  authorUsername,
  authorProfilePic,
  votes,
  userVoteType,
  onVote,
  onEdit,
  onDelete,
  isAuthor
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleEditSubmit = () => {
    onEdit(replyId, { content: editedContent })
    setIsEditing(false)
  }

  return (
    <div className='replyItem-container'>
      <div className='replyItem-author'>
        {authorProfilePic && (
          <img
            src={authorProfilePic}
            alt={authorUsername}
            className='author-avatar'
          />
        )}
        <span className='author-name'>@{authorUsername}</span>
      </div>

      <div className='replyItem-main'>
        {isEditing ? (
          <div className='edit-form'>
            <textarea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              placeholder='Edit your reply...'
            />
            <button onClick={handleEditSubmit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <p className='replyItem-content'>{content}</p>
            <span className='timestamp'>
              Replied{' '}
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>

            <div className='replyItem-footer'>
              <div className='replyItem-votes'>
                <button
                  type='button'
                  className={`vote-button upvote ${
                    userVoteType === 'up' ? 'active' : ''
                  }`}
                  onClick={e => {
                    e.preventDefault()
                    onVote('up')
                  }}
                  title='Upvote'
                >
                  ▲
                </button>
                <span className='vote-count'>{votes}</span>
                <button
                  className={`vote-button downvote ${
                    userVoteType === 'down' ? 'active' : ''
                  }`}
                  onClick={() => onVote('down')}
                  title='Downvote'
                >
                  ▼
                </button>
              </div>

              <div className='replyItem-actions'>
                {isAuthor && (
                  <>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={onDelete}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ReplyItem
