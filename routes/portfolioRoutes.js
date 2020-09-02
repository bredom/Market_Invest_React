const router = require('express').Router();
const { check } = require('express-validator');

// Import Controllers
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', portfolioController.getPortfolio);
router.post(
  '/',
  [check('name', 'Portfolio must have a name').trim().escape().not().isEmpty()],
  portfolioController.createPortfolio
);
router.patch(
  '/',
  [check('name', 'Portfolio must have a name').trim().escape().not().isEmpty()],
  portfolioController.updatePortfolio
);
router.delete('/', portfolioController.deletePortfolio);

router.post(
  '/add-stock',
  [
    check('ticker', 'Please add correct ticker.')
      .trim()
      .escape()
      .not()
      .isEmpty()
      .isAlphanumeric(),
  ],
  portfolioController.addStockToPortfolio
);
router.post(
  '/delete-stock/:stockId',
  portfolioController.deleteStockFromPortfolio
);

module.exports = router;
