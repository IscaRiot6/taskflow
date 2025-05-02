import React, { useState, useEffect } from 'react';
import '../../styles/forumStyles/PostItem.css';
import { formatDistanceToNow } from 'date-fns';
// import 'bootstrap/dist/css/bootstrap.min.css'

const PostItem = ({ postId, title, content, votes, createdAt, tags = [], onVote, userVoteType, authorUsername,
  authorProfilePic, onEdit, onDelete, isAuthor }) => {
    const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedTags, setEditedTags] = useState(tags.join(', '));

  const handleEditSubmit = () => {
    onEdit(postId, {
      title: editedTitle,
      content: editedContent,
      tags: editedTags
    });
    setIsEditing(false);
  };

  return (
    <div className="postItem-container">
      <div className="postItem-author">
        {authorProfilePic && (
          <img src={authorProfilePic} alt={authorUsername} className="author-avatar" />
        )}
        <span className="author-name">@{authorUsername}</span>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Content"
          />
          <input
            type="text"
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            placeholder="Tags (comma separated)"
          />
          <button onClick={handleEditSubmit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <h3 className="postItem-title">{title}</h3>
          <p className="postItem-preview">
            {content.length > 100 ? content.slice(0, 100) + '...' : content}
          </p>

          <span className="timestamp">
            Posted {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>

          {tags.length > 0 && (
            <div className="postItem-tags">
              {tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="postItem-votes">
            <button
            type="button"
              className={`vote-button upvote ${userVoteType === 'up' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onVote('up');
              }}
              
              title="Upvote"
            >
              ▲
            </button>
            <span className="vote-count">{votes}</span>
            <button
              className={`vote-button downvote ${userVoteType === 'down' ? 'active' : ''}`}
              onClick={() => onVote('down')}
              title="Downvote"
            >
              ▼
            </button>
          </div>

          {isAuthor && (
            <div className="postItem-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(postId)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};




export default PostItem;
