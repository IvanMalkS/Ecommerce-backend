const mongoose = require('mongoose');
const Product = require('./productsModel');

const reviewSchema = new mongoose.Schema(
  {
    pluses: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    minuses: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    review: {
      type: String,
      required: true,
      maxLength: 500,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    // User id
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    // Product id
    Product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//Adding pre hook to populate User and Product fields
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: 'name',
  }).populate({
    path: 'Product',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        Product: productId._id,
      },
    },
    {
      $group: {
        _id: '$Product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  //Adding dynamic calculation
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: stats[0].avgRating,
      ratingCount: stats[0].nRating,
    });
  } else
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingCount: 0,
    });
};

// Adding on post
reviewSchema.post('save', function (next) {
  this.constructor.calcAverageRatings(this.Product);
});

// Making update and delete rating dynamic
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.id = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.id.constructor.calcAverageRatings(this.id.Product);
});

reviewSchema.index({ User: 1, Product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
