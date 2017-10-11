const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const foldersController = require('../controllers/folders');

router.get('/', helper.auth, foldersController.fetchFolders);
router.put('/star', helper.auth, foldersController.starFolder);
router.get('/root', helper.auth, foldersController.fetchRootFolders);

router.get('/:id', helper.auth, foldersController.fetchById);
// router.post('/', helper.auth, foldersController.fetchByPath);


module.exports = router;
