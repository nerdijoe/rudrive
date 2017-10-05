const router = require('express').Router();

const userController = require('../controllers/users');
const helper = require('../helpers/authVerifyHelper');

// router.get('/', userController.getAll);

router.get(`/about`, helper.auth, userController.getAbout );

module.exports = router;
