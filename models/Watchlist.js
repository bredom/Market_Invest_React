mongoose = require('mongoose');
const slugify = require('slugify');

const watchlistSchema = new mongoose.Schema(
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
        type: {
          type: String,
          enum: ['stock', 'etf'],
          default: 'stock',
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

watchlistSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

watchlistSchema.virtual('numberStocks').get(function () {
  const stocks = [...this.stocks];

  const filtered = stocks.filter(stock => stock.type === 'stock');

  return filtered.length;
});

watchlistSchema.virtual('numberEtfs').get(function () {
  const stocks = [...this.stocks];

  const filtered = stocks.filter(stock => stock.type === 'etf');

  return filtered.length;
});

watchlistSchema.methods.addStockToWatchlist = function (stock) {
  const stocks = [...this.stocks];
  const { ticker, type } = stock;

  const found = stocks.find(stock => stock.ticker === ticker);
  if (found) {
    return {
      success: false,
      msg: 'Stock already in watchlist.',
    };
  }

  if (ticker && type) {
    const newStock = { ticker, type };
    stocks.push(newStock);

    this.stocks = stocks;
    this.save();

    return {
      success: true,
      stock: newStock,
    };
  } else {
    return {
      success: false,
      msg: 'Problem with adding stock to watchlist. Try again',
    };
  }
};

// Delete Stock from watchlist
watchlistSchema.methods.deleteStockFromWatchlist = function (stockId) {
  const updatedStocks = this.stocks.filter(stock => {
    return stock._id.toString() !== stockId.toString();
  });

  if (updatedStocks.length === this.stocks.length) {
    return {
      success: false,
    };
  }

  this.stocks = updatedStocks;
  this.save();

  return {
    success: true,
  };
};

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
module.exports = Watchlist;
