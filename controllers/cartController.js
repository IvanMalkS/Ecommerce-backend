//TEST VERSION
const Cart = require('../models/cartModel');
const catchAsyncErrors = require('./../utils/catchAsyncErrors');

exports.addToCart = catchAsyncErrors(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  // Найти корзину пользователя
  let cart = await Cart.findOne({ user: userId });

  // Если корзины нет, создать новую
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  // Найти товар в корзине, если он там есть
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  // Если товар уже в корзине, увеличить количество
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    // Добавить новый товар в корзину
    cart.items.push({ product: productId, quantity });
  }

  // Сохранить обновленную корзину
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully.',
  });
});

exports.removeFromCart = async (req, res) => {
  const userId = req.body.userid;
  const { productId } = req.params;

  // Find the cart by the user ID
  const cart = await Cart.findById(userId).exec();
  if (!cart) {
    return res.status(404).json({
      status: 'fail',
      message: 'No cart found for this user.',
    });
  }

  // Remove the item from the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (itemIndex >= 0) {
    cart.items.splice(itemIndex, 1);
    await cart.save();

    return res.status(200).json({
      status: 'success',
      message: 'Item removed from cart.',
    });
  } else {
    return res.status(404).json({
      status: 'fail',
      message: 'Item not found in cart.',
    });
  }
};

exports.getCartItems = catchAsyncErrors(async (req, res) => {
  const userId = req.user._id;

  // find cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({
      status: 'fail',
      message: 'No cart found for this user.',
    });
  }

  res.status(200).json({
    status: 'success',
    cart: cart.items,
  });
});
