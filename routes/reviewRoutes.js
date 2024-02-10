const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const express = require('express');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    reviewController.setReviewIds,
    reviewController.addReview,
  )
  .get(reviewController.getReviews);

router
  .route('/:id')
  .delete(authController.protect, reviewController.deleteReview)
  .patch(authController.protect, reviewController.updateReview)
  .get(reviewController.getReviews);
module.exports = router;
