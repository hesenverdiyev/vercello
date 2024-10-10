import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
  pageFrom: {
    type: String,
    required: true
  },
  commenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commenterName: {
    type: String,
    required: true
  },
  commentDate: {
    type: Date,
    default: Date.now
  },
  commentText: {
    type: String,
    required: true
  }
});


const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
