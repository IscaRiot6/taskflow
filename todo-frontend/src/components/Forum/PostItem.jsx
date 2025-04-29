import React from 'react';
import '../../styles/forumStyles/PostItem.css';
import { formatDistanceToNow } from 'date-fns';

const PostItem = ({ title, content, votes, createdAt, tags = [], onVote }) => {
  return (
    <div className="postItem-container">
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
        <button className="vote-button upvote" onClick={() => onVote('up')} title="Upvote">
          ▲
        </button>
        <span className="vote-count">{votes}</span>
        <button className="vote-button downvote" onClick={() => onVote('down')} title="Downvote">
          ▼
        </button>
      </div>
    </div>
  );
};




export default PostItem;
