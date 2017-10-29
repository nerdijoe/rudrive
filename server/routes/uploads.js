const router = require('express').Router();
const multer = require('multer');

const uploadsController = require('../controllers/uploads');
const helper = require('../helpers/authVerifyHelper');

// File upload ----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    let filename = file.originalname;
    let name = filename.split('.')[0];
    let ext = filename.split('.')[1];
    cb(null, name + '_' + Date.now() + "." + ext);
  }
});

const upload = multer({ storage });

// need to check jwt token before uploading a file.
router.post('/', [helper.auth, upload.single('doc')], uploadsController.uploadFile);
// router.post('/', [helper.auth, upload.single('doc')], uploadsController.uploadFileToPath);

router.get('/listdir', helper.auth, uploadsController.listDir);

router.post('/createfolder', helper.auth, uploadsController.createDirMongo);

router.post('/:currentPath', [helper.auth, upload.single('doc')], uploadsController.uploadFileToPathMongo);


module.exports = router;
