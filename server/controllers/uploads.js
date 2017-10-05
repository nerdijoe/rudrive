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
  const userEmail = req.decoded.email;


  var dir = `./public/uploads/${userEmail}`;
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
  const userEmail = req.decoded.email;
  const files = fs.readdirSync(`./public/uploads/${userEmail}`);
  res.json(files);
};

exports.createDir = (req, res) => {
  console.log('createDir')
  const userEmail = req.decoded.email;

  const newDirName = req.body.name;
  const currentPath = req.body.currentPath;

  // var newDirPath = `./public/uploads/${userEmail}/${newDirName}`;
  var newDirPath = `${currentPath}/${newDirName}`;
  // create dir if it doesn't exist
  if (!fs.existsSync(newDirPath)) {
    fs.mkdirSync(newDirPath);
    console.log(`folder '${newDirName}' is created`);
  } else {
    console.log(`folder '${newDirName}' is already existed`);
  }

  const files = fs.readdirSync(`${currentPath}`);
  res.json(files);
};
