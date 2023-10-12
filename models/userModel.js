const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
		// select: false
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		minlength: 8,
		select: false,
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

// * password encyption
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
