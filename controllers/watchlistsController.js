const { AppError } = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const Watchlist = require('../models/Watchlist');
const slugify = require('slugify');
const { validationResult } = require('express-validator');

// Get Watchlists
exports.getWatchlists = catchAsync(async (req, res, next) => {
  const watchlists = await Watchlist.find({ user: req.user.id }); //getting Watchlist using logged in user id

  if (!watchlists[0]) {
    return next(new AppError('No watchlists found for this user', 400));
  }

  res.status(200).json({
    success: true,
    watchlists,
  });
});

// Get Watchlist
exports.getWatchlist = catchAsync(async (req, res, next) => {
  const watchlist = await Watchlist.findOne({
    user: req.user.id,
    slug: req.params.slug,
  });

  if (!watchlist) {
    return next(new AppError('No watchlist found.', 404));
  }

  res.status(200).json({
    success: true,
    watchlist,
  });
});

// Create Watchlist
exports.createWatchlist = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const slug = slugify(req.body.name, { lower: true });

  const watchlist = await Watchlist.findOne({ user: req.user.id, slug });

  if (watchlist) {
    return next(
      new AppError(
        'Watchlist with this name already exist. Choose different name.',
        404
      )
    );
  }

  const newWatchlist = await Watchlist.create({
    name: req.body.name,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    watchlist: newWatchlist,
  });
});

// Update watchlist
exports.updateWatchlist = catchAsync(async (req, res, next) => {
  const watchlist = await Watchlist.findOne({
    user: req.user.id,
    slug: req.body.slug,
  });

  if (!watchlist) {
    return next(new AppError('No watchlist found for this user.', 404));
  }

  watchlist.name = req.body.name;
  watchlist.slug = slugify(watchlist.name, { lower: true });
  await watchlist.save();

  res.status(200).json({
    success: true,
    watchlist,
  });
});

// Delete watchlist
exports.deleteWatchlist = catchAsync(async (req, res, next) => {
  const watchlist = await Watchlist.findOne({
    user: req.user.id,
    slug: req.body.slug,
  });

  if (!watchlist) {
    return next(new AppError('No watchlist found.', 404));
  }

  const watchlistDeleted = await Watchlist.findByIdAndDelete(watchlist.id);

  if (!watchlistDeleted) {
    return next(new AppError('Failed to delete watchlist.', 404));
  }

  res.status(200).json({
    success: true,
  });
});

// Add stock to watchlist
exports.addStockToWatchlist = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const watchlist = await Watchlist.findOne({
    user: req.user.id,
    slug: req.body.slug,
  });

  if (!watchlist) {
    return next(new AppError("Stock wasn't added. Watchlist not found.", 404));
  }

  const updatedWatchlist = await watchlist.addStockToWatchlist(req.body);

  if (updatedWatchlist.success === false) {
    return next(new AppError(updatedWatchlist.msg, 404));
  }

  res.status(200).json({
    success: true,
    stock: updatedWatchlist.stock,
  });
});

// Delete stock to watchlist
exports.deleteStockFromWatchlist = catchAsync(async (req, res, next) => {
  const watchlist = await Watchlist.findOne({
    user: req.user.id,
    slug: req.params.slug,
  });

  if (!watchlist) {
    return next(new AppError('No watchlist found.', 404));
  }

  const deletedStock = await watchlist.deleteStockFromWatchlist(
    req.params.stockId
  );

  if (deletedStock.success === false) {
    return next(new AppError('No stock was deleted. Try again', 404));
  }

  res.status(200).json({
    success: true,
  });
});
