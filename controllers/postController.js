const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllPosts = catchAsync(async (req, res, next) => {

  const posts = await Post.find().select(["author"]);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
	// Extract post data from the request body
	const { title, content } = req.body;

	// Access the currently authenticated user from req.user
	const createdBy = req.user._id; // Assuming your User model has an '_id' field
	console.log(createdBy)
	//console.log(req)

	// Create the post and associate it with the user
	const newPost = await Post.create({
		title,
		content,
		createdBy, // Associate the post with the user
	});

	res.status(201).json({
		status: 'success',
		data: {
			post: newPost,
		},
	});
});

