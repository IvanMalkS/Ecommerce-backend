// TEST VERSION
const authController = require('./../controllers/authController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const cartController = require('./../controllers/cartController');

router
  .route('/add-to-cart')
  .post(authController.protect, cartController.addToCart);

router
  .route('/remove-from-cart/:productId')
  .delete(authController.protect, cartController.addToCart);

router
  .route('/your-cart')
  .get(authController.protect, cartController.getCartItems);

module.exports = router;
