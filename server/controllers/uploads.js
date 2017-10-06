const fs = require('fs');
const db = require('../models');

exports.uploadFile = (req, res) => {
  // console.log('uploadFile req', req);
  console.log('uploadFile req.body', req.body);
  console.log('uploadFile req.file', req.file);

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

    // add to db
    /* 
    uploadFile req.file { fieldname: 'doc',
      originalname: 'Police.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: './public/uploads/',
      filename: 'Police_1507247984057.csv',
      path: 'public/uploads/Police_1507247984057.csv',
      size: 5740 }
    */
    const new_file = {
      name: req.file.filename,
      path: dir,
      full_path: target_path,
      type: req.file.mimetype,
      size: req.file.size,
      is_starred: false,
      user_id: req.decoded._id,
    };
    db.File.create(new_file)
    .then( file => {
      console.log('>>>> DB inserted a new file', file);

      res.json(file);
    })

  })

  // res.status(204).end();
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
