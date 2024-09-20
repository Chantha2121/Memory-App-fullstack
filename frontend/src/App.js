import React, { useState, useEffect } from 'react';
import { FaUser, FaThumbsUp } from 'react-icons/fa';
import './index.css';
import PostForm from './components/PostForm';
import PostUpdate from './components/PostUpdate'; // Import PostUpdate component
import { fetchPosts } from './services/api';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [updatingPost, setUpdatingPost] = useState(null); // State for managing updates

  // Fetch posts
  const getPosts = async () => {
    try {
      const response = await fetchPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    getPosts(); // Fetch posts on component mount
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/post/delete/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdate = (post) => {
    setUpdatingPost(post); // Set the post to be updated
  };

  const handleLike = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:3005/post/like/${id}`);
      const updatedPost = response.data;
      setPosts(posts.map(post => (post._id === id ? updatedPost : post)));
      setLikedPosts(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const togglePostForm = () => {
    setEditingPost(null);
    setShowPostForm(prevState => !prevState);
  };

  return (
    <div className="App min-h-screen bg-gray-100 p-6">
      <header className="bg-gradient-to-r from-purple-500 to-blue-600 text-white py-6 text-center text-3xl font-extrabold shadow-md mb-6">
        Memory App
      </header>
      <button
        onClick={togglePostForm}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition mb-4"
      >
        {showPostForm ? 'Close Form' : 'Create New Memory'}
      </button>
      <main className="flex container mx-auto px-4">
        <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 ${showPostForm || updatingPost ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
          {posts.map(post => (
            <div key={post._id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 hover:shadow-xl transition duration-300">
              {post.selectedFile && (
                <img
                  src={`/uploads/${post.selectedFile}`}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">{post.message}</p>
                
                {/* Render Tags */}
                {post.tags && (
                  <div className="mb-4">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FaUser className="mr-2 text-gray-500" />
                    <span className="font-medium text-gray-700">{post.creator}</span>
                  </span>
                  <span className="flex items-center cursor-pointer" onClick={() => handleLike(post._id)}>
                    <FaThumbsUp className={`mr-2 ${likedPosts[post._id] ? 'text-blue-600' : 'text-gray-500'} transition-transform transform ${likedPosts[post._id] ? 'scale-110' : ''}`} />
                    <button className={`font-medium ${likedPosts[post._id] ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-transform transform ${likedPosts[post._id] ? 'scale-150' : ''}`}>
                      {post.likeCount}
                    </button>
                  </span>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleUpdate(post)}
                    className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded shadow hover:bg-yellow-600 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-7">
          {/* Display PostForm for creating new post */}
          {showPostForm && (
            <PostForm
              editingPost={editingPost}
              setShowPostForm={setShowPostForm}
              refreshPosts={getPosts} // Pass the getPosts function to refresh the data
            />
          )}

          {/* Display PostUpdate for updating post */}
          {updatingPost && (
            <PostUpdate
              post={updatingPost}
              setUpdatingPost={setUpdatingPost} // To close the form after updating
              refreshPosts={getPosts} // To refresh the posts after update
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
