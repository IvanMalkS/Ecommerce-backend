const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// ROUTES WHICH NOT REQUIRES AUTHENTICATION
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:id', authController.resetPassword);

router.use(authController.protect);
// ONLY AUTHENTICATED USERS CAN ACCESS THIS ROUTE

router.route('/me').get(userController.getMe, userController.getUser);

router.patch('/updateMyPassword', authController.updatePassword);

router.patch(
  '/updateMyInfo',
  userController.uploadPhoto,
  userController.resizePhoto,
  userController.updateUserInfo,
);

router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));
// ONLY ADMIN CAN ACCESS THIS ROUTE

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
