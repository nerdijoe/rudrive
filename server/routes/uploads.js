const router = require('express').Router();
const uploadsController = require('../controllers/uploads');

const multer = require('multer');

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
router.post('/', upload.single('doc'), uploadsController.uploadFile);

router.get('/listdir', uploadsController.listDir);


module.exports = router;
