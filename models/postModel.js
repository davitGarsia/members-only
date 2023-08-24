const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please, enter the title for the post'],
  },
  body: {
    type: String,
    required: [true, 'Please, write your post'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
