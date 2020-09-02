const { AppError } = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const { validationResult } = require('express-validator');
const Portfolio = require('../models/Portfolio');

// Get Portfolio
exports.getPortfolio = catchAsync(async (req, res, next) => {
  //getting portfolio using logged in user id
  const portfolio = await Portfolio.findOne({ user: req.user.id }).populate(
    'user'
  );

  res.status(200).json({
    success: true,
    portfolio,
  });
});

// Create Portfolio
exports.createPortfolio = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const portfolio = await Portfolio.findOne({ user: req.user.id });

  if (portfolio) {
    return next(new AppError('This user already has a portfolio', 404));
  }

  const newPortfolio = await Portfolio.create({
    name: req.body.name,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    portfolio: newPortfolio,
  });
});

// Update portfolio
exports.updatePortfolio = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const portfolio = await Portfolio.findOne({ user: req.user.id });

  if (!portfolio) {
    return next(new AppError('No portfolio found for this user.', 404));
  }

  portfolio.name = req.body.name;
  await portfolio.save();

  res.status(200).json({
    success: true,
    portfolio,
  });
});

// Delete Portfolio
exports.deletePortfolio = catchAsync(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ user: req.user.id });

  if (!portfolio) {
    return next(new AppError('No portfolio found for this user.', 404));
  }

  const portfolioDeleted = await Portfolio.findByIdAndDelete(portfolio.id);

  if (!portfolioDeleted) {
    return next(new AppError('Failed to delete portfolio.', 404));
  }

  res.status(200).json({
    success: true,
  });
});

// Add stock to portfolio
exports.addStockToPortfolio = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const portfolio = await Portfolio.findOne({ user: req.user.id });

  if (!portfolio) {
    return next(new AppError('No portfolio found for this user.', 404));
  }

  const updatedPortfolio = await portfolio.addStockToPortfolio(req.body);

  res.status(200).json({
    success: true,
    portfolio: updatedPortfolio,
  });
});

// Add stock to portfolio
exports.deleteStockFromPortfolio = catchAsync(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ user: req.user.id });

  if (!portfolio) {
    return next(new AppError('No portfolio found for this user.', 404));
  }

  const deletedStock = await portfolio.deleteStockFromPortfolio(
    req.params.stockId
  );

  if (!deletedStock) {
    return next(new AppError('No stock was deleted. Try again', 404));
  }

  res.status(200).json({
    success: true,
  });
});
