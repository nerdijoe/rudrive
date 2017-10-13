const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const filesController = require('../controllers/files');

router.get('/', helper.auth, filesController.fetchFiles);
router.get('/root', helper.auth, filesController.fetchRootFilesWithShare);

router.put('/star', helper.auth, filesController.starFile);

// File Sharing
router.post('/share', helper.auth, filesController.addFileSharing);

module.exports = router;
