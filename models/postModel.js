const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please, enter the title for the post'],
  },
  content: {
    type: String,
    required: [true, 'Please, write your post'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   // required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
