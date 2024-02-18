const { promisify } = require('util');
const User = require('./../models/usersModel');
const catchAsyncErrors = require('./../utils/catchAsyncErrors');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const crypto = require('crypto');

const jwtGenerator = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = jwtGenerator(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  };

  res.cookie('jwt', token, cookieOption);

  // remove password from user object
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.signup = catchAsyncErrors(async (req, res, next) => {
  // To protect against SQL injection attacks
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const Url = `${req.protocol}://${req.get('host')}/catalog`;
  await new Email(newUser, Url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password'), 400);
  }

  //check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }
  //check if password matches
  const isMatch = await user.matchPassword(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  //if all checks pass, generate token
  createSendToken(user, 201, res);
});

// restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('User do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.protect = catchAsyncErrors(async (req, res, next) => {
  let token = null;
  let decoded = null;

  // Get token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please provide a valid token', 401));
  }

  // Verify token
  decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user is still in the database
  const FreshUser = await User.findById(decoded.id);
  if (!FreshUser) {
    return next(new AppError('User belonging the token does not exist', 401));
  }

  //Check if user is still valid
  if (FreshUser.changedPassword(decoded.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  //Access granted
  req.user = FreshUser;
  next();
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }
  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Email sent',
    });
  } catch (err) {
    user.resetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('try again late!', 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(new AppError('Please provide all fields', 400));
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.id)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, password, passwordConfirm } = req.body;

  // Check for undefined values
  if (!oldPassword || !password || !passwordConfirm) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  // Check is user in db
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  // Compare passwords
  if (!(await user.matchPassword(oldPassword, user.password))) {
    return next(new AppError('Invalid password', 401));
  } else {
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save({ validateBeforeSave: false });
    createSendToken(user, 201, res);
  }
});
