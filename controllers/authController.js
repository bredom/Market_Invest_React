const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/AppError');

const User = require('../models/User');

//getting single user if authenticated
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('Server Error', 500));
  }

  res.json(user);
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials.' }] });
  }

  const isMatch = await user.correctPassword(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials.' }] });
  }

  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({ token });
});
