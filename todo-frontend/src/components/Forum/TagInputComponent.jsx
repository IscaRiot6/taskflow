import React, { useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

const TagInputComponent = () => {
  const [tags, setTags] = useState([]);

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  return (
    <ReactTags
      tags={tags}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      placeholder="Add new tag"
    />
  );
};

export default TagInputComponent;
