mongoose = require('mongoose');
const slugify = require('slugify');

const portfolioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    stocks: [
      {
        ticker: {
          type: String,
          required: true,
        },
        company: {
          type: String,
        },
        buyPrice: {
          type: Number,
        },
        buyDate: {
          type: Date,
          default: Date.now(),
        },
        shares: {
          type: Number,
          default: 1,
        },
        type: {
          type: String,
          enum: ['Stock', 'ETF'],
          default: 'Stock',
        },
      },
    ],
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

portfolioSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

portfolioSchema.virtual('numberShares').get(function () {
  const counter = this.stocks.reduce((acc, stock) => {
    return acc + stock.shares;
  }, 0);

  return counter;
});

portfolioSchema.methods.addStockToPortfolio = function (stock) {
  const stocks = [...this.stocks];

  stocks.push(stock);

  this.stocks = stocks;
  return this.save();
};

// Delete Stock from portfolio
portfolioSchema.methods.deleteStockFromPortfolio = function (stockId) {
  const updatedStocks = this.stocks.filter(stock => {
    return stock._id.toString() !== stockId.toString();
  });

  if (updatedStocks.length === this.stocks.length) {
    return false;
  }

  this.stocks = updatedStocks;

  return this.save();
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;
