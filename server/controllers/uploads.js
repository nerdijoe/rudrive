const fs = require('fs');

// File upload ----

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now());
//   }
// });

// const upload = multer({ storage }).single('doc');

exports.uploadFile = (req, res) => {
  // console.log('uploadFile req', req);
  console.log('uploadFile req.body', req.body);
  console.log('uploadFile req.file', req.file);

  // upload(req, res, err => {
  //   if (err) {
  //     res.end('Error upload');
  //   }
  //   res.end('File is uploaded');
  // })

  res.status(204).end();
};

exports.listDir = (req, res) => {
  const files = fs.readdirSync('./public/uploads');
  res.json(files);
};
