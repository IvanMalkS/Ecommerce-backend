const express = require('express');
const productController = require('../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router();
const reviewRouter = require('./reviewRoutes');

router.use('/:productId/reviews', reviewRouter);

//routes for smartphones
router.route('/new-smartphones').get(productController.getNewProducts);

//routes for product
router
  .route('/')
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadProductImages,
    productController.resizeImage,
    productController.getNewProducts,
  );

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadProductImages,
    productController.resizeImage,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct,
  );

module.exports = router;
