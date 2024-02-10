const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const catchAsyncErrors = require('./../utils/catchAsyncErrors');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter a valid email'],
    unique: [true, 'Email already exists'],
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  photo: {
    type: String,
    default: '../assets/images/default-user.png',
  },
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  role: {
    type: String,
    default: 'consumer',
    enum: ['consumer', 'admin'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  cartProducts: {
    type: Array,
    default: [],
  },
  cartTotal: {
    type: Number,
    default: 0,
  },
  lickedProducts: {
    type: Array,
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  buyHistory: {
    type: Array,
    default: [],
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  location: [String],
});

userSchema.pre('save', async function (next) {
  // if password pass the validation
  if (!this.isModified('password')) return next();

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // passwordConfirm is not required in db
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const ChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < ChangedTimestamp;
  }
  return false;
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hashing token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.matchPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
