const catchAsyncErrors = require('./../utils/catchAsyncErrors');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const multer = require('multer');
const sharp = require('sharp');
const multerStorage = multer.memoryStorage();
const fs = require('fs');
const path = require('path');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Uploaded file is not image', 404), false);
  }
};

const uploader = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// for 1 img file
exports.resizeImage = (folderName) =>
  catchAsyncErrors(async (req, res, next) => {
    if (!req.file) return next();

    // Detect the file type
    const fileType = req.file.mimetype.split('/')[1];
    const fileMimeType = req.file.mimetype.split('/')[0];

    // Generate a unique filename
    randomString = Math.random().toString(36).substring(2, 15);
    req.file.filename = `img-${req.file.originalname}-${randomString}-${Date.now()}`;

    if (!fileType || !fileMimeType) {
      return next(new AppError('Uploaded file is not image', 404));
    }

    // Generate the correct file path including the file extension
    const baseDir = './public/img';
    const outputDir = path.join(baseDir, folderName);
    const outputPath = path.join(outputDir, `${req.file.filename}.${fileType}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Compress images to reduce the file size by type
    if (fileType === 'jpeg' || fileType === 'jpg' || fileType === 'webp') {
      await sharp(req.file.buffer).jpeg({ quality: 75 }).toFile(outputPath);
    } else if (fileType === 'png') {
      await sharp(req.file.buffer)
        .png({ compressionLevel: 3 })
        .toFile(outputPath);
    }

    next();
  });

//for upload photo
exports.uploadImage = uploader.single('image');

exports.deleteOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
      return next(new AppError(`Provide real id`, 400));
    }

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError(`Object does not found`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const updatedData = req.body;
    if (req.file) updatedData.image = req.file.filename;

    const data = await Model.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    //Error id handler
    if (!data) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data,
    });
  });

exports.createOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const newData = new Model(req.body);
    const data = await newData.save();
    res.status(201).json({
      status: 'success',
      data,
    });
  });

exports.getOne = (Model, populate, select) =>
  catchAsyncErrors(async (req, res, next) => {
    populate = populate || [];
    select = select || [];
    const id = req.params.id;
    let data = await Model.findById(id).populate(populate).select(select);
    if (!data) {
      return next(new AppError(`Object does not found`, 404));
    }
    res.status(200).json({
      status: 'success',
      data,
    });
  });

exports.getAll = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    //To get nested data use populate
    let filter = {};
    if (req.params.productId) filter = { Product: req.params.productId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filterQuery()
      .sortQuery()
      .limitFields()
      .paginate();

    const data = await features.query;

    res.status(200).json({
      status: 'success',
      data_count: data.length,
      data,
    });
  });
