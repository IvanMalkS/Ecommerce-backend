const authController = require('./../controllers/authController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const cartController = require('./../controllers/cartController');

router.route('/my-cart').get(authController.protect, cartController.getCart);

router
  .route('/add-to-cart/:productId')
  .patch(authController.protect, cartController.addToCart);

router
  .route('/delete-from-cart/:productId')
  .patch(authController.protect, cartController.deleteFromCart);

module.exports = router;
