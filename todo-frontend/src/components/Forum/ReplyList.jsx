import React, { useState, useEffect } from 'react';
import forumApi from '../../api/forumApi';
import ReplyItem from './ReplyItem';
// import '../../styles/forumStyles/ReplyList.css';

const ReplyList = ({ postId }) => {
  const { getRepliesByPostId } = forumApi();

  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const data = await getRepliesByPostId(postId);
        setReplies(data);
      } catch (error) {
        console.error('Failed to load replies');
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [postId]);

  if (loading) return <p>Loading replies...</p>;

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
