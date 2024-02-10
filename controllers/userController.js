const User = require('./../models/usersModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const AppError = require('../utils/appError');
const HandleFactory = require('./../controllers/handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

exports.updateUserInfo = catchAsyncErrors(async (req, res, next) => {
  //security check
  if (req.body.password) {
    return next(new AppError('Password cannot be updated', 400));
  }
  if (req.body.role) {
    return next(new AppError('Role cannot be updated', 400));
  }

  const filteredUser = filterObj(req.body, 'name', 'email');
  if (req.file) filteredUser.photo = req.file.filename;

  //update user info
  user = await User.findByIdAndUpdate(req.user.id, filteredUser, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.getMe = catchAsyncErrors(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.deleteMe = catchAsyncErrors(async (req, res, next) => {
  user = await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = HandleFactory.getAll(User);

exports.createUser = HandleFactory.createOne(User);

exports.getUser = HandleFactory.getOne(User);

exports.updateUser = HandleFactory.updateOne(User);

exports.deleteUser = HandleFactory.deleteOne(User);

exports.resizePhoto = HandleFactory.resizeImage('user');

exports.uploadPhoto = HandleFactory.uploadImage;
