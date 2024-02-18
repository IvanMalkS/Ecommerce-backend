const User = require('./../models/usersModel');
const CatchAsyncErrors = require('./../utils/catchAsyncErrors');

exports.getCart = CatchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('cart');
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.addToCart = CatchAsyncErrors(async (req, res, next) => {
  const productID = req.params.productId;
  const user = await User.findById(req.user._id).select('cart');

  // Check for existing cart
  const itemIndex = user.cart.findIndex((item) => item.productID == productID);

  if (itemIndex > -1) {
    // if product already on cart change quantity
    user.cart[itemIndex].quantity += 1;
  } else {
    user.cart.push({ productID: productID, quantity: 1 });
  }

  await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteFromCart = CatchAsyncErrors(async (req, res, next) => {
  const productID = req.params.productId;
  const user = await User.findById(req.user._id).select('cart');

  // Check for existing cart
  const itemIndex = user.cart.findIndex((item) => item.productID == productID);

  if (itemIndex > -1) {
    // if product already on cart change quantity
    if (user.cart[itemIndex].quantity > 1) {
      user.cart[itemIndex].quantity -= 1;
    } else {
      user.cart.splice({ productID: productID, quantity: 1 }, 1);
    }
  }

  await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
