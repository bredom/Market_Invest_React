const { AppError } = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const Screener = require('../models/Screener');

// Get Criteria Tabs
exports.getCriteriaTabs = catchAsync(async (req, res, next) => {
  const tabs = await Screener.find();

  res.status(200).json({
    success: true,
    tabs,
  });
});

// Create Criteria Tab
exports.createCriteriaTab = catchAsync(async (req, res, next) => {
  const newTab = await Screener.create(req.body);

  res.status(201).json({
    success: true,
    tab: newTab,
  });
});
