const router = require('express').Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const usersController = require('../controllers/usersController');

router.post(
  '/',
  [
    check('firstName', 'Please provide your first name').not().isEmpty(),
    check('lastName', 'Please provide your last name').not().isEmpty(),
    check('email', 'Please provide a correct email').isEmail(),
    check('password', 'Password is required').exists(),
    check('password', 'Password must be min 6 characters').isLength({ min: 6 }),
  ],
  usersController.signup
);

router.use(auth);

module.exports = router;
