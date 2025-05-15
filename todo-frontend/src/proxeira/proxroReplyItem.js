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
  isAuthor,
  onReply
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleEditSubmit = () => {
    onEdit(replyId, { content: editedContent })
    setIsEditing(false)
  }

  const handleNestedReplySubmit = () => {
    if (!replyContent.trim()) return
    onReply(replyId, replyContent) // Pass replyId as parent
    setReplyContent('')
    setIsReplying(false)
  }

  return (
    <div className='replyItem-container'>
      <div className='replyItem-content'>
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
              {isReplying ? (
                <div className='nested-reply-form'>
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder='Write a reply...'
                  />
                  <button onClick={handleNestedReplySubmit}>Submit</button>
                  <button onClick={() => setIsReplying(false)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsReplying(true)}>Reply</button>
              )}
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
    </div>
  )
}

export default ReplyItem
