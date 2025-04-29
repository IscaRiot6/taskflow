import React from 'react';
import '../../styles/forumStyles/PostItem.css';
import { formatDistanceToNow } from 'date-fns';
// import 'bootstrap/dist/css/bootstrap.min.css'

const PostItem = ({ title, content, votes, createdAt, tags = [], onVote, userVoteType, authorUsername,
  authorProfilePic }) => {
  return (
    <div className="postItem-container">
      <div className="postItem-author">
        {authorProfilePic && (
        <img src={authorProfilePic} alt={authorUsername} className="author-avatar" />
        )}
         <span className="author-name">@{authorUsername}</span>
      </div>
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
          className={`vote-button upvote ${userVoteType === 'up' ? 'active' : ''}`}
          onClick={() => onVote('up')}
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
    </div>
  );
};




export default PostItem;
