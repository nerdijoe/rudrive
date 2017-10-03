const router = require('express').Router();
const uploadsController = require('../controllers/uploads');

const multer = require('multer');

// File upload ----
var storage = multer.diskStorage({
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

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, './public/uploads/')
//   },
//   filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
//   }
// });

const upload = multer({ storage: storage });


// router.post('/', upload.single('doc'), uploadsController.uploadFile);

router.post('/', upload.single('doc'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  res.status(204).end();
});


module.exports = router;
