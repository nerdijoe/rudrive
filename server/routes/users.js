const router = require('express').Router();

const userController = require('../controllers/users');
const activityController = require('../controllers/activities');
const helper = require('../helpers/authVerifyHelper');

// router.get('/', userController.getAll);

router.get('/about', helper.auth, userController.getAbout);
router.put('/about', helper.auth, userController.updateAbout);

router.get('/interest', helper.auth, userController.getInterest);
router.put('/interest', helper.auth, userController.updateInterest);

router.post('/activities', helper.auth, activityController.insertActivityMongo);
router.get('/activities', helper.auth, activityController.fetchActivitiesMongo);

module.exports = router;
