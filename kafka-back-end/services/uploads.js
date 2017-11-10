const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-west-2',
});

const Folder = require('../models/mongoose_folder');
const File = require('../models/mongoose_file');

module.exports = {
  uploadFile: (msg, cb) => {

    const req = msg;

    console.log('uploadFile msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const currentPath = req.currentPath;

    Folder.findOne({ _id: currentPath }, (err, folder) => {
      console.log('After Folder.findOne, folder=', folder);
      const file = req.file;
      const userEmail = req.decoded.email;

      console.log('file', file);
      
      // var dir = `./public/uploads/${userEmail}`;
      let dir = `./public/uploads/${userEmail}`;
      if (folder) {
        dir = folder.full_path;
      }
      
      // create dir if it doesn't exist
      if (!fs.existsSync(dir)) {
        console.log(`~~~~~~ dir'${dir}' does not exist, so create one`);
        fs.mkdirSync(dir);
      }
  
      const default_path = file.path;
      const target_path = dir + '/' + file.filename;
  
      // fs.rename(default_path, target_path, (err) => {
      fs.writeFile(target_path, req.binaryFile, 'binary', (err) => {
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
          aws_s3_path: req.aws_s3_path,
          type: req.file.mimetype,
          size: req.file.size,
          is_starred: false,
          user: user_id,
          is_deleted: false,
        });
  
        console.log('---------------- newFile.full_path=', newFile.full_path);
        // Need to upload to AWS S3 before inserting the file entry to MongoDB
        //   because we need to get the AWS S3 path
        // newFile.full_path = './public/uploads/bro23@haha.com/server_PNG15.png';
        // fs.readFile(newFile.full_path, (err, data) => {
        //   if (err) { throw err; }
          // Read in the file, convert it to base64, store to S3
          // const base64data = new Buffer(data, 'binary');
          
          // console.log("data = ", data);

          // var s3 = new AWS.S3();
          // const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

          // const uploadParams = {
          //   Bucket: 'dropbox-kafka',
          //   Key: req.decoded.email + '/' + newFile.name,
          //   Body: data,
          //   ACL: 'public-read',
          // };

          // s3.upload(uploadParams, (err, data) => {
          //   if (err) {
          //     console.log('Error', err);
          //     cb(err);
          //   } if (data) {
          //     console.log('data =', data);
          //     newFile.aws_s3_path = data.Location;
          //     console.log("Upload Success", newFile.aws_s3_path);


          //     newFile.save((err, savedFile) => {
          //       console.log('>>>> inserted to mongoDB, savedFile=', savedFile);
          //       // res.json(file)
          //       cb(false, savedFile);
          //     }); // eof newFile.save
          //   }
          // }); // eof s3.upload

        newFile.save((err, savedFile) => {
          console.log('>>>> inserted to mongoDB, savedFile=', savedFile);
          // res.json(file)
          cb(false, savedFile);
        }); // eof newFile.save

          // s3.client.putObject({
          //   Bucket: 'dropbox-kafka',
          //   Key: file.name,
          //   Body: base64data,
          //   ACL: 'public-read'
          // }, (resp) => {
          //   console.log(arguments);
          //   console.log('Successfully uploaded package.');

          // });
        // }); // eof fs.readFile

      }); // end of fs.writeFile
    });
  },
  createFolder: (msg, cb) => {
    const req = msg;

    console.log('uploadFile msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const userEmail = req.decoded.email;

    const newDirName = req.body.name;
    const currentPath = req.body.currentPath;

    // var newDirPath = `./public/uploads/${userEmail}/${newDirName}`;
    const newDirPath = `${currentPath}/${newDirName}`;
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
        // res.json(folder);
        cb(false, folder);
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
      // res.json(msg);
      cb(false, msg);
    }

  }
};
