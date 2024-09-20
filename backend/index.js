import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import { config } from 'dotenv';
import { createPost,deletepost,getPosts, likePost, updatePost } from './controller/posts.js'; // Assuming your controller functions are here

config();

const app = express();
const port = process.env.PORT || 3005; // Use a default port if not defined
const mbUrl = process.env.url;

// Connect to MongoDB
mongoose.connect(mbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database is connected successfully');
  })
  .catch(err => {
    console.log(err);
  });

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());


// Configure multer storage with destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/uploads'); // Specify the absolute destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique name
    cb(null, uniqueSuffix + '-' + file.originalname); // Use the original name with a unique suffix
  }
});

// Initialize multer with storage
const upload = multer({ storage });

// Define routes directly
app.get('/post/get', getPosts);
app.post('/post/create', upload.single('selectedFile'), createPost);
app.patch('/post/like/:id',likePost)
app.delete('/post/delete/:id',deletepost)
app.patch('/post/update/:id',updatePost)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
