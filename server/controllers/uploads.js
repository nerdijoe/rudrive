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
  console.log('uploadFile req.decoded', req.decoded);
  const file = req.file;
  const user_email = req.decoded.email;


  var dir = `./public/uploads/${user_email}`;
  // create dir if it doesn't exist
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  const default_path = file.path;
  const target_path = dir + '/' + file.filename;

  fs.rename(default_path, target_path, err => {
    if (err) throw err;

    console.log(`>>> ${file.filename} has been moved to ${target_path}`);
  })


  res.status(204).end();
};

exports.listDir = (req, res) => {
  const files = fs.readdirSync('./public/uploads');
  res.json(files);
};
