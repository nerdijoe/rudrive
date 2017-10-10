const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const foldersController = require('../controllers/folders');

router.get('/', helper.auth, foldersController.fetchFolders);
router.put('/star', helper.auth, foldersController.starFolder);

module.exports = router;
