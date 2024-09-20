import axios from 'axios';

export const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3005/post/get');
    return response;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = (formData) => axios.post('http://localhost:3005/post/create', formData, {
  headers: {
    'Content-Type': 'multipart/form-data', // Set the correct headers for file upload
  },
});
export const updatePost = async (id, formData) => {
  try {
    const response = await axios.patch(`http://localhost:3005/post/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // Ensure correct content type for file upload
      },
    });
    return response.data; // Return the updated post data
  } catch (error) {
    console.error('Error updating post:', error.response?.data || error.message); // Log error details
    throw error; // Throw error so it can be handled in the calling function
  }
};