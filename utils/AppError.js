//CUSTOM ERROR HANDLER CLASS
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //If super() not working then  use super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.success = false;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

//GLOBAL ERROR HANDLER

const handleJsonWebTokenError = () => {
  return new AppError('Invalid Token. Please log in again', 401);
};

//Development Error
const sendErrorDev = (err, req, res) => {
  //API
  console.error('APP ERROR: ', err);

  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

//Production Error
const sendErrorProd = (err, req, res) => {
  //API
  //Operational trusted error: send messsage to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }
  //Programming error: dont't leak details

  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Server Error.',
  });
};

//Error Handler
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    // error.message = err.message;

    // if (error.name === 'ValidationError') error = handleValidationError(error);
    if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError(err);

    sendErrorProd(err, req, res);
  }
};

module.exports = {
  AppError,
  globalErrorHandler,
};
