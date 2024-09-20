import Postmessage from '../model/postMessage.js';

export const getPosts = async (req, res) => {
  try {
    const getPost = await Postmessage.find();
    res.status(200).json(getPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const { creator, title, message, tags } = req.body;
  const selectedFile = req.file?.filename; // Extract file name (assuming Multer is used correctly)

  const newPost = new Postmessage({
    creator,
    title,
    message,
    tags,
    selectedFile, // File name is saved in the database
  });

  try {
    const savedPost = await newPost.save(); // Save post and get the saved document
    res.status(201).json(savedPost); // Send the saved post as response
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const likePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Postmessage.findById(id);
    post.likeCount += 1; // Increment the like count
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const deletepost = async (req, res) => {
    const { id } = req.params;
    
    try {
      // Find post by ID and delete it
      const deletedPost = await Postmessage.findByIdAndDelete(id);

      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
}

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator } = req.body;

  // Parse the tags if they are sent as a JSON string or array
  let tags;
  try {
    tags = req.body.tags ? JSON.parse(req.body.tags) : [];
  } catch (error) {
    // Handle parsing error
    return res.status(400).json({ message: 'Invalid tags format' });
  }

  let selectedFile = req.file?.filename; // Handle file upload if present

  try {
    // Check if the post exists
    const post = await Postmessage.findById(id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Prepare the updated data with conditionals
    const updatedData = {
      title: title || post.title,
      message: message || post.message,
      creator: creator || post.creator,
      tags: tags.length > 0 ? tags : post.tags, // Only update tags if provided
      ...(selectedFile && { selectedFile }) // Only update selectedFile if a new one is provided
    };

    // Update the post with new data
    const updatedPost = await Postmessage.findByIdAndUpdate(id, updatedData, { new: true });

    // Return the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    // Log any errors
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

