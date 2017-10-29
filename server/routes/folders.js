const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const foldersController = require('../controllers/folders');

router.get('/', helper.auth, foldersController.fetchFolders);
router.get('/root', helper.auth, foldersController.fetchRootFoldersWithShare);

router.put('/star', helper.auth, foldersController.starFolderMongo);
router.put('/delete', helper.auth, foldersController.deleteFolderMongo);

router.post('/share', helper.auth, foldersController.addFolderSharingMongo);
router.get('/share', helper.auth, foldersController.fetchFolderSharingMongo);
router.put('/share', helper.auth, foldersController.removeFolderSharingMongo);

router.get('/:id', helper.auth, foldersController.fetchByIdMongo);
// router.post('/', helper.auth, foldersController.fetchByPath);


module.exports = router;
