const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth');

router.post('/signup', authController.signupMongoKafka);
router.post('/signin', passport.authenticate('local', { session: false }), authController.signin);

// router.post('/signin', authController.signin);

module.exports = router;
