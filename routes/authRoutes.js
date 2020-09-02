const router = require('express').Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post(
  '/',
  [
    check('email', 'Please provide a correct email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

router.use(auth);
router.get('/', authController.getUser);

module.exports = router;
