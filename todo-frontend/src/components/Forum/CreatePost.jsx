import React, { useState } from 'react';
import forumApi from '../../api/forumApi';
import '../../styles/forumStyles/CreatePost.css';
import { toast } from 'react-toastify';
import { WithContext as ReactTags } from 'react-tag-input';

const CreatePost = ({ refreshPosts }) => {
  const { createPost } = forumApi();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tagTexts = tags.map(tag => tag.text);
      await createPost(title, content, tagTexts);
      setTitle('');
      setContent('');
      setTags([]);
      toast.success('Post created!');
      await refreshPosts();
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
      <div className="forumPost-tagsInputWrapper">
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          placeholder="Add new tag"
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
