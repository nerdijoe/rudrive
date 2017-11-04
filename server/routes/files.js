const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const filesController = require('../controllers/files');

router.get('/', helper.auth, filesController.fetchFilesMongo);
router.get('/root', helper.auth, filesController.fetchRootFilesWithShareMongoKafka);

router.put('/star', helper.auth, filesController.starFileMongoKafka);
router.put('/delete', helper.auth, filesController.deleteFileMongoKafka);

// File Sharing
router.post('/share', helper.auth, filesController.addFileSharingMongoKafka);
router.get('/share', helper.auth, filesController.fetchFileSharingMongoKafka);
router.put('/share', helper.auth, filesController.removeFileSharingMongoKafka);

module.exports = router;
