const router = require('express').Router();

const helper = require('../helpers/authVerifyHelper');
const foldersController = require('../controllers/folders');

router.get('/', helper.auth, foldersController.fetchFoldersMongo);
router.get('/root', helper.auth, foldersController.fetchRootFoldersWithShareMongoKafka);

router.put('/star', helper.auth, foldersController.starFolderMongoKafka);
router.put('/delete', helper.auth, foldersController.deleteFolderMongoKafka);

router.post('/share', helper.auth, foldersController.addFolderSharingMongoKafka);
router.get('/share', helper.auth, foldersController.fetchFolderSharingMongoKafka);
router.put('/share', helper.auth, foldersController.removeFolderSharingMongoKafka);

router.get('/:id', helper.auth, foldersController.fetchByIdMongoKafka);
// router.post('/', helper.auth, foldersController.fetchByPath);


module.exports = router;
