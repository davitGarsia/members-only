// Authentication
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

   httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Signup
exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const newUser = await User.create({
    name: req.body.name,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
  
});

exports.login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return next(new AppError('Please, provide userName and password', 400));
  }

  const user = await User.findOne({ userName }).select('+password');

  // if (!user || !(await user.correctPassword(password, user.password))) {
  //   return next(new AppError('Incorrect userName or password', 401));
  // }

  createSendToken(user, 200, res);
  User.memberStatus = true;
  console.log(User.memberStatus);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }


  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }


  const decoded = await promisify(jwt.verify(token, process.env.JWT_SECRET));
	console.log(decoded);
  
  const currUser = await User.findById(decoded.id);
  console.log(currUser);
  if (!currUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  if (currUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, please log in again', 401)
    );
  }

  req.user = currUser;
  console.log(req.user);

  next();
});
