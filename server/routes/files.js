const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const filesController = require('../controllers/files');

router.get('/', helper.auth, filesController.fetchFilesMongo);
router.get('/root', helper.auth, filesController.fetchRootFilesWithShareMongo);

router.put('/star', helper.auth, filesController.starFileMongo);
router.put('/delete', helper.auth, filesController.deleteFileMongo);

// File Sharing
router.post('/share', helper.auth, filesController.addFileSharingMongo);
router.get('/share', helper.auth, filesController.fetchFileSharingMongo);
router.put('/share', helper.auth, filesController.removeFileSharingMongo);

module.exports = router;
