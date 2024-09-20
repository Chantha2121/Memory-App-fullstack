import express from 'express';
import multer from 'multer';
import { createPost, getPosts } from '../controller/posts.js';
import { storage } from '../index.js';

const upload = multer({storage: storage})

const routes = express.Router();

routes.get('/get', getPosts);
routes.post('/create', upload.single('selectedFile'), createPost);

export default routes;
