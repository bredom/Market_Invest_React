const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/AppError');

const User = require('../models/User');

exports.signup = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'User with this email already exists.' }] });
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
  });

  const payload = {
    user: {
      id: newUser.id,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({ token });
});
