const router = require('express').Router();

// Import Controllers
const screenerController = require('../controllers/screenerController');
// const auth = require('../middleware/auth');

// router.use(auth);

router.get('/', screenerController.getCriteriaTabs);
router.post('/', screenerController.createCriteriaTab);

module.exports = router;
