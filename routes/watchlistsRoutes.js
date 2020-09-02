const router = require('express').Router();
const { check } = require('express-validator');

// Import Controllers
const watchlistController = require('../controllers/watchlistsController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', watchlistController.getWatchlists);
router.get('/:slug', watchlistController.getWatchlist);
router.post(
  '/',
  [check('name', 'Watchlist must have a name').trim().escape().not().isEmpty()],
  watchlistController.createWatchlist
);
router.patch('/', watchlistController.updateWatchlist);
router.delete('/', watchlistController.deleteWatchlist);
router.post(
  '/add-stock',
  [check('ticker', 'Please add ticker').trim().escape().not().isEmpty()],
  watchlistController.addStockToWatchlist
);
router.post(
  '/:slug/delete-stock/:stockId',
  watchlistController.deleteStockFromWatchlist
);

module.exports = router;
