const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: 40,
      unique: [true, 'Title must be unique'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    colors: {
      type: [String],
      required: [true, 'Product must have at least 1 color'],
    },
    image: {
      type: [String],
      required: [true, 'Image is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    countInStock: {
      type: Number,
      required: [true, 'Count in stock is required'],
    },
    salePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    dateRelease: {
      type: Date,
      default: Date.now,
      required: [true, 'Date release is required'],
    },
    specifications: {
      type: [String],
      select: false,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10, // round to 1 decimal place
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productsSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'Product',
});

const Product = mongoose.model('Product', productsSchema);

module.exports = Product;
