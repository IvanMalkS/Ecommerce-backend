const Product = require('../models/productsModel');

const HandleFactory = require('./../controllers/handleFactory');

exports.getProductById = HandleFactory.getOne(
  Product,
  'reviews',
  '+specifications',
);

exports.resizeImage = HandleFactory.resizeImage('product');

exports.uploadProductImages = HandleFactory.uploadImage;

exports.getProducts = HandleFactory.getAll(Product);

exports.updateProduct = HandleFactory.updateOne(Product);

exports.deleteProduct = HandleFactory.deleteOne(Product);

exports.getNewProducts = HandleFactory.createOne(Product);
