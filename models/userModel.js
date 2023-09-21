const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, tell us your name'],
  },

  lastName: {
    type: String,
    required: [true, 'Please, tell us your last name'],
  },

  userName: {
    type: String,
    required: [true, 'Please enter your username'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'Please, provide a valid email for your username',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 8,
    //select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  memberStatus: {
    type: Boolean,
  },
  passwordChangedAt: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
