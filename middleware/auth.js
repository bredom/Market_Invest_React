const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return next(new AppError('No token, authorization denied', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};
