import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  creator: String,
  tags: [String],
  selectedFile: String, // This should match the field used for file uploads
  likeCount: {
    type: Number,
    default: 0
  },
  createAt: {
    type: Date,
    default: new Date()
  },
});

const Postmessage = mongoose.model('PostMessage', postSchema);

export default Postmessage;
