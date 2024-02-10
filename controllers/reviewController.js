Review = require('./../models/reviewModel');
const HandleFactory = require('./../controllers/handleFactory');

exports.setReviewIds = (req, res, next) => {
  if (!req.body.Product) req.body.Product = req.params.productId;
  if (!req.body.User) req.body.User = req.user.id;
  next();
};

exports.getReviews = HandleFactory.getAll(Review);
exports.addReview = HandleFactory.createOne(Review);
exports.updateReview = HandleFactory.updateOne(Review);
exports.deleteReview = HandleFactory.deleteOne(Review);
exports.getReview = HandleFactory.getOne(Review);
