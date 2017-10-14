const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const foldersController = require('../controllers/folders');

router.get('/', helper.auth, foldersController.fetchFolders);
router.put('/star', helper.auth, foldersController.starFolder);
router.get('/root', helper.auth, foldersController.fetchRootFoldersWithShare);


router.post('/share', helper.auth, foldersController.addFolderSharing);
router.get('/share', helper.auth, foldersController.fetchFolderSharing);
router.put('/share', helper.auth, foldersController.removeFolderSharing);

router.get('/:id', helper.auth, foldersController.fetchById);
// router.post('/', helper.auth, foldersController.fetchByPath);


module.exports = router;
