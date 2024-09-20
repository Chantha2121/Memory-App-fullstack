import React, { useState, useEffect } from 'react';
import { updatePost } from '../services/api';

function PostUpdate({ post, setUpdatingPost, refreshPosts }) {
  const [postData, setPostData] = useState({
    title: '',
    message: '',
    creator: '',
    tags: '',
  });
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title,
        message: post.message,
        creator: post.creator,
        tags: post.tags ? post.tags.join(',') : '',
      });
      if (post.selectedFile) {
        setFilePreview(`/uploads/${post.selectedFile}`);
      }
    }
  }, [post]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPostData({ ...postData, selectedFile: file });
    if (file) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()) : postData.tags;
    const formData = new FormData();
    formData.append('creator', postData.creator);
    formData.append('title', postData.title);
    formData.append('message', postData.message);
    formData.append('tags', JSON.stringify(tagsArray));
    if (postData.selectedFile) {
      formData.append('selectedFile', postData.selectedFile);
    }

    try {
      await updatePost(post._id, formData);
      console.log("Update success") // Update post by ID
      refreshPosts(); // Refresh the posts after updating
      setUpdatingPost(null); // Close the update form
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-300 w-full max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Message</label>
          <textarea
            className="w-full p-2 border rounded"
            value={postData.message}
            onChange={(e) => setPostData({ ...postData, message: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tags (comma separated)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={postData.tags}
            onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          <input type="file" onChange={handleFileChange} />
          {filePreview && (
            <img src={filePreview} alt="Preview" className="mt-4 max-w-xs" />
          )}
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setUpdatingPost(null)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostUpdate;
