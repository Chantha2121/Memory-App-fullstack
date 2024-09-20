import React, { useState } from "react";
import { createPost } from "../services/api"; 

function PostForm({ setShowPostForm, refreshPosts }) {
  const [postData, setPostData] = useState({
    title: '',
    message: '',
    creator: '',
    tags: '',  
  });

  const [filePreview, setFilePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert tags to array if it's a string
    const tagsArray = postData.tags.split(',').map(tag => tag.trim());

    const formData = new FormData();
    formData.append('creator', postData.creator);
    formData.append('title', postData.title);
    formData.append('message', postData.message);
    formData.append('tags', JSON.stringify(tagsArray));

    if (postData.selectedFile) {
      formData.append('selectedFile', postData.selectedFile); // Add file if selected
    }

    try {
      await createPost(formData); // Create a new post
      refreshPosts(); // Refresh posts after submission
      setShowPostForm(false); // Close the form
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPostData({ ...postData, selectedFile: file });
    if (file) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-300 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Creator"
          value={postData.creator}
          onChange={(e) => setPostData({ ...postData, creator: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Title"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Message"
          rows="4"
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        ></textarea>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Tags (comma separated)"
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
        />
        <input
          type="file"
          className="w-full p-3 border border-gray-300 rounded-md"
          onChange={handleFileChange}
        />
        {filePreview && <img src={filePreview} alt="Preview" className="mt-2 max-h-56 object-contain" />}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default PostForm;
