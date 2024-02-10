const AppError = require('./../utils/appError');

//Errors when trying to save to the database wrong values.
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = errors.join(', ');
  return new AppError(message, 400);
};

//Errors when trying to save to the database wrong value.
const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//Errors when trying to save to the database same field.
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate ${value}`;
  return new AppError(message, 400);
};

//More errors info for development.
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//JWT Error when trying to verify the token.
const handleJWTError = () => {
  return new AppError('Invalid JWT Token', 401);
};

//JWT Error when trying to verify the expired token.
const handleJWTExpired = () => {
  return new AppError('JWT Token Expired', 401);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') {
      handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      handleJWTExpired();
    }
  }
};
