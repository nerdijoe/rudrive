const router = require('express').Router();

const userController = require('../controllers/users');
const activityController = require('../controllers/activities');
const helper = require('../helpers/authVerifyHelper');

// router.get('/', userController.getAll);

router.get('/about', helper.auth, userController.getAboutMongoKafka);
router.put('/about', helper.auth, userController.updateAboutMongoKafka);

router.get('/interest', helper.auth, userController.getInterestMongoKafka);
router.put('/interest', helper.auth, userController.updateInterestMongoKafka);

router.post('/activities', helper.auth, activityController.insertActivityMongoKafka);
router.get('/activities', helper.auth, activityController.fetchActivitiesMongoKafka);

module.exports = router;
