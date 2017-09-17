const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth');

router.post('/signup', authController.signup);

module.exports = router;
