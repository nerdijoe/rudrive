const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth_sequelize');

router.post('/signup', authController.signup);
router.post('/signin', passport.authenticate('local', { session: false }), authController.signin);

// router.post('/signin', authController.signin);

module.exports = router;
