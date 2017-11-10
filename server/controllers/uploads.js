const mongoose = require('mongoose');
const fs = require('fs');
const AWS = require('aws-sdk');

const db = require('../models');
const Folder = require('../models/mongoose_folder');
const File = require('../models/mongoose_file');
const kafka = require('../routes/kafka/client');
const action = require('../helpers/actionConstants');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-west-2',
});

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
      is_deleted: false,
    };
    db.File.create(new_file)
    .then( file => {
      console.log('>>>> DB inserted a new file', file);

      res.json(file);
    })

  })

  // res.status(204).end();
};


exports.uploadFileToPath = (req, res) => {
  // console.log('uploadFile req', req);
  console.log('uploadFile req.body', req.body);
  console.log('uploadFile req.file', req.file);

  console.log('uploadFile req.decoded', req.decoded);
  console.log(`currentPath = [${req.params.currentPath}] `, typeof req.params.currentPath);

  // need to query the path

  const currentPath = req.params.currentPath;

  // if (currentPath > 0) {

  // }

  db.Folder.findOne({
    where: {
      user_id: req.decoded._id,
      id: currentPath,
    },
  }).then((folder) => {
    console.log('**** after querying for the folder', folder);
    const file = req.file;
    const userEmail = req.decoded.email;

    // var dir = `./public/uploads/${userEmail}`;
    let dir = `./public/uploads/${userEmail}`;
    if (folder) {
      dir = folder.full_path;
    }
    
    // create dir if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const default_path = file.path;
    const target_path = dir + '/' + file.filename;

    fs.rename(default_path, target_path, (err) => {
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
        is_deleted: false,
      };
      db.File.create(new_file)
        .then((file) => {
          console.log('>>>> DB inserted a new file', file);

          res.json(file);
        });
    }); // end of fs.rename
  });


  // res.status(204).end();
};

exports.listDir = (req, res) => {
  const userEmail = req.decoded.email;
  const files = fs.readdirSync(`./public/uploads/${userEmail}`);
  res.json(files);
};

exports.createDir = (req, res) => {
  console.log('createDir req.decoded._id=', req.decoded._id)
  const userEmail = req.decoded.email;

  const newDirName = req.body.name;
  const currentPath = req.body.currentPath;

  // var newDirPath = `./public/uploads/${userEmail}/${newDirName}`;
  var newDirPath = `${currentPath}/${newDirName}`;
  // create dir if it doesn't exist
  if (!fs.existsSync(newDirPath)) {
    fs.mkdirSync(newDirPath);
    console.log(`folder '${newDirName}' is created`);

    // insert to DB
    const new_folder = {
      name: newDirName,
      path: currentPath,
      full_path: newDirPath,
      is_starred: false,
      is_deleted: false,
      user_id: req.decoded._id,
    };
    db.Folder.create(new_folder)
      .then( (folder) => {
        console.log('>>>> DB inserted a new folder', folder);
        res.json(folder);

        // need to return the newly created folder with the Users
        // db.Folder.findAll({
        //   where: { id: folder_id },
        //   include: [{ model: db.User }],
        // }).then((shareInfo) => {
        //   console.log('shareInfo', shareInfo);
        //   res.json(shareInfo);
        // });

      })
  } else {
    const msg = {
      message: `folder '${newDirName}' is already existed`,
    };
    console.log(msg);
    res.json(msg);
  }

  // const files = fs.readdirSync(`${currentPath}`);
  // res.json(files);
};

// MongoDB ---------------------------------------------------------------

exports.uploadFileToPathMongo = (req, res) => {
  // console.log('uploadFile req', req);
  console.log('uploadFileToPathMongo req.body', req.body);
  console.log('uploadFileToPathMongo req.file', req.file);

  console.log('uploadFileToPathMongo req.decoded', req.decoded);
  console.log(`currentPath = [${req.params.currentPath}] `, typeof req.params.currentPath);

  // need to query the path

  const currentPath = req.params.currentPath;

  // find folder
  // if yes, then get the full path
  // if no upload to root folder
  // create dir if it does not exist
  // then insert to file
  Folder.findOne({ _id: currentPath }, (err, folder) => {
    console.log('After Folder.findOne, folder=', folder);
    const file = req.file;
    const userEmail = req.decoded.email;

    // var dir = `./public/uploads/${userEmail}`;
    let dir = `./public/uploads/${userEmail}`;
    if (folder) {
      dir = folder.full_path;
    }
    
    // create dir if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const default_path = file.path;
    const target_path = dir + '/' + file.filename;

    fs.rename(default_path, target_path, (err) => {
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

      const user_id = mongoose.Types.ObjectId(req.decoded._id);
      // todo.tasks.push(task_id);

      const newFile = File({
        name: req.file.filename,
        path: dir,
        full_path: target_path,
        type: req.file.mimetype,
        size: req.file.size,
        is_starred: false,
        user: user_id,
        is_deleted: false,
      });

      newFile.save((err, file) => {
        console.log('>>>> inserted to mongoDB, file=', file);

        res.json(file);
      });
    }); // end of fs.rename
  });
};


exports.createDirMongo = (req, res) => {
  console.log('createDir req.decoded._id=', req.decoded._id)
  const userEmail = req.decoded.email;

  const newDirName = req.body.name;
  const currentPath = req.body.currentPath;

  // var newDirPath = `./public/uploads/${userEmail}/${newDirName}`;
  var newDirPath = `${currentPath}/${newDirName}`;
  // create dir if it doesn't exist
  if (!fs.existsSync(newDirPath)) {
    fs.mkdirSync(newDirPath);
    console.log(`folder '${newDirName}' is created`);

    // insert to DB
    const newFolder = Folder({
      name: newDirName,
      path: currentPath,
      full_path: newDirPath,
      is_starred: false,
      is_deleted: false,
      user: mongoose.Types.ObjectId(req.decoded._id),
    });

    newFolder.save((err, folder) => {
      console.log('>>>> mongo inserted a new folder', folder);
      res.json(folder);
    });

    // db.Folder.create(new_folder)
    //   .then( (folder) => {
    //     console.log('>>>> DB inserted a new folder', folder);
    //     res.json(folder);

    //     // need to return the newly created folder with the Users
    //     // db.Folder.findAll({
    //     //   where: { id: folder_id },
    //     //   include: [{ model: db.User }],
    //     // }).then((shareInfo) => {
    //     //   console.log('shareInfo', shareInfo);
    //     //   res.json(shareInfo);
    //     // });

    //   })
  } else {
    const msg = {
      message: `folder '${newDirName}' is already existed`,
    };
    console.log(msg);
    res.json(msg);
  }

  // const files = fs.readdirSync(`${currentPath}`);
  // res.json(files);
};


// Kafka ----------

exports.uploadFileToPathMongoKafka = (req, res) => {
  // console.log('uploadFile req', req);
  console.log('uploadFileToPathMongoKafka req.body', req.body);
  console.log('uploadFileToPathMongoKafka req.file', req.file);

  console.log('uploadFileToPathMongoKafka req.decoded', req.decoded);
  console.log(`currentPath = [${req.params.currentPath}] `, typeof req.params.currentPath);

  // need to query the path

  fs.readFile(req.file.path, (err, data) => {
    const binaryFile = new Buffer(data, 'binary');
    console.log('binaryFile = ', binaryFile);

    const currentPath = req.params.currentPath;

    kafka.make_request('request_topic', {
      action: action.ADD_NEW_FILE,
      body: req.body,
      file: req.file,
      currentPath,
      binaryFile,
      decoded: req.decoded,
    }, (err, results) => {
      console.log('uploadFileToPathMongoKafka');
      // console.log('   results=', results);
      if (err) {
        console.log('  ----> uploadFileToPathMongoKafka Error');
        res.json(err);
      } else {
        res.json(results);
      }
    });
  });
};

exports.uploadFileKafkaS3 = (req, res) => {
  // console.log('uploadFile req', req);
  console.log('uploadFileKafkaS3 req.body', req.body);
  console.log('uploadFileKafkaS3 req.file', req.file);

  console.log('uploadFileKafkaS3 req.decoded', req.decoded);
  console.log(`currentPath = [${req.params.currentPath}] `, typeof req.params.currentPath);

  // need to query the path

  fs.readFile(req.file.path, (err, data) => {
    const binaryFile = new Buffer(data, 'binary');
    console.log('binaryFile = ', binaryFile);

    const currentPath = req.params.currentPath;


    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    const uploadParams = {
      Bucket: 'dropbox-kafka',
      Key: req.decoded.email + '/' + req.file.filename,
      Body: data,
      ACL: 'public-read',
    };

    s3.upload(uploadParams, (err, uploadedData) => {
      if (err) {
        console.log('Error', err);
        cb(err);
      } if (uploadedData) {
        console.log('uploadedData =', uploadedData);
        const aws_s3_path = uploadedData.Location;
        console.log("Upload Success aws_s3_path=", aws_s3_path);

        kafka.make_request('request_topic', {
          action: action.ADD_NEW_FILE,
          body: req.body,
          file: req.file,
          currentPath,
          binaryFile,
          aws_s3_path,
          decoded: req.decoded,
        }, (err, results) => {
          console.log('uploadFileToPathMongoKafka');
          // console.log('   results=', results);
          if (err) {
            console.log('  ----> uploadFileToPathMongoKafka Error');
            res.json(err);
          } else {
            res.json(results);
          }
        });
      }
    });
  });
};

exports.createDirMongoKafka = (req, res) => {
  console.log('createDirMongoKafka req.decoded._id=', req.decoded._id)

  kafka.make_request('request_topic', {
    action: action.ADD_NEW_FOLDER,
    body: req.body,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('createDirMongoKafka');
    // console.log('   results=', results);
    if (err) {
      console.log('  ----> createDirMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};
