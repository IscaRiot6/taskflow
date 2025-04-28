import React, { useState } from 'react';
import forumApi from '../../api/forumApi';
import '../../styles/forumStyles/CreatePost.css';
import { toast } from 'react-toastify';
const CreatePost = () => {
  const { createPost } = forumApi();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createPost(title, content);
      setTitle('');
      setContent('');
      toast.success('Post created!'); // 🎯 show success notification
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="forumPost-form">
      <div className="forumPost-inputWrapper">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="forumPost-titleInput"
        />
      </div>
      <div className="forumPost-textareaWrapper">
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="forumPost-contentTextarea"
        />
      </div>
      {error && <p className="forumPost-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="forumPost-submitButton"
      >
        {loading ? 'Posting...' : 'Create Post'}
      </button>
    </form>
  );
  
};

export default CreatePost;
