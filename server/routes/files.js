const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const filesController = require('../controllers/files');

router.get('/', helper.auth, filesController.fetchFiles);
router.put('/star', helper.auth, filesController.starFile);
router.get('/root', helper.auth, filesController.fetchRootFiles);

module.exports = router;
