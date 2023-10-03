const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  console.log(req.user)
  let posts; 

  if (req.user) {
	posts = await Post.find()
  } else {
	posts = await Post.find().select(['-createdBy'])
  }

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
	const { title, content } = req.body;

	const createdBy = req.user._id;
	const newPost = await Post.create({
		title,
		content,
		createdBy, 
	});
	//const jh = await Post.find().populate("user"); to reference another document

	res.status(201).json({
		status: 'success',
		data: {
			post: newPost,
		},
	});
});

