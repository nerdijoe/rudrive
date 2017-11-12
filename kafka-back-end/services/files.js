const mongoose = require('mongoose');
const File = require('../models/mongoose_file');
const User = require('../models/mongoose_user.js');

// const MongoPool = require('../helpers/customConnectionPooling');
// const customPool = new MongoPool(10);
// customPool.initPool();
// customPool.getIndex();

module.exports = {
  fetchFiles: (msg, cb) => {

    const req = msg;
    
    console.log('fetchFiles msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));
    console.log('---> path=', process.env.ROOT_FOLDER + req.decoded.email)

    // const db = customPool.get();
    // const dbFile = db.model('File');
    // // console.log('******* customPool db ',db);
    
    // dbFile
    File
      .find({
        user: mongoose.Types.ObjectId(req.decoded._id),
        path: process.env.ROOT_FOLDER + req.decoded.email,
      })
      .populate('user')
      .populate('users')
      .exec((err, files) => {
        console.log('after fetchRootFilesWithShareMongo files=', files);

        // res.json(files);
        cb(false, files);
      });
  },
  starFile: (msg, cb) => {
    const req = msg;
    console.log('starFile msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const file = req.body;
    console.log(`typeof file.is_starred=${typeof file.is_starred}`);

    let star_status = file.is_starred;
    if ((typeof file.is_starred) !== 'boolean') {
      star_status = (file.is_starred === 'true');
    }
    console.log(`starFile is_starred=${file.is_starred}, star_status = ${star_status}, typeof ${typeof star_status}`);

    // format date to ISO
    const d = new Date();
    const n = d.toISOString();

    File.findByIdAndUpdate(
      file._id,
      {
        $set: {
          is_starred: !star_status,
          updatedAt: n,
        },
      },
      (err, result) => {
        console.log('after starFile result=', result);
        if (result.nModified === 1) {
          console.log("file is starred successfully");
          // res.json(true);
          cb(false, true);
        } else {
          // res.json(false);
          cb(false, false);
        }
      }
    );
  },
  deleteFile: (msg, cb) => {
    const req = msg;
    console.log('deleteFile msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const file = req.body;
    console.log(`typeof file.is_deleted=${typeof file.is_deleted}`);

    let delete_status = file.is_deleted;
    if ((typeof file.is_deleted) !== 'boolean') {
      delete_status = (file.is_deleted === 'true');
    }
    console.log(`deleteFileMongo is_deleted=${file.is_deleted}, delete_status = ${delete_status}, typeof ${typeof delete_status}`);

    // format date to ISO
    const d = new Date();
    const n = d.toISOString();

    File.findByIdAndUpdate(
      file._id,
      {
        $set: {
          is_deleted: !delete_status,
          updatedAt: n,
        },
      },
      (err, result) => {
        console.log('after deleteFileMongo result=', result);
        if (result.nModified === 1) {
          console.log(`file [${file.name}]is deleted successfully`);
          // res.json(true);
          cb(false, true);
        } else {
          // res.json(false);
          cb(false, false);
        }
      }
    );
  },
  addFileSharing: (msg, cb) => {
    const req = msg;
    console.log('addFolderSharing msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    let users = req.body.users.split(/[,]\s/);
    console.log('users=', users);
    const file_id = mongoose.Types.ObjectId(req.body.file_id);
  
    User.find({
      email: {
        $in: users,
      },
    }, (err, fetchedUsers) => {
      // fetch the file
      File.findById(file_id, (err2, fetchedFile) => {
        fetchedUsers.map((user) => {
          fetchedFile.users.push(user._id);
        });
  
        fetchedFile.save((err3, savedFile) => {
          if (err3) cb(false, err3); //res.json(err3);
          console.log('***** savedFile', savedFile);
  
          savedFile
            .populate({
              path: 'users',
              model: 'User',
            })
            .populate({
              path: 'user',
              model: 'User',
            }, (err4, file) => {
              if (err4) cb(false, err4); //es.json(err4);
              // res.json(file);
              cb(false, file);
            });
        });
      });
    });
  },
  removeFileSharing: (msg, cb) => {
    const req = msg;
    console.log('removeFileSharing msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const user_id = mongoose.Types.ObjectId(req.body.user_id);
    const file_id = mongoose.Types.ObjectId(req.body.file_id);
  
    File.findById(
      file_id,
      (err, file) => {
        // console.log(' **** file.users[0]', file.users[0]);
        // console.log(`typeof user_id=`, typeof user_id);
        // console.log(`typeof file.users[0]= ${typeof file.users[0]}`);
        // const pos = file.users.findIndex(i => i === file_id);
        const pos = file.users.indexOf(user_id);
        // console.log('******* pos=', pos);      
        if (pos !== -1) {
          file.users.splice(pos, 1);
          file.save((err, savedFile) => {
            // console.log('******* savedFile=', savedFile);
            if (err) cb(false, err); //res.json(err);
            // res.json({ msg: 'Remove file share is successful.' });
            cb(false, { msg: 'Remove file share is successful.' });
          });
        } else {
          // res.json({ msg: 'error' });
          cb(false, { msg: 'error' });
        }
      }
    );
  },
  fetchFileSharing: (msg, cb) => {
    const req = msg;
    console.log('fetchFileSharing msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    File
      .find({
        users: mongoose.Types.ObjectId(req.decoded._id),
      })
      .populate('user')
      .populate('users')
      .exec((err, files) => {
        if (err) cb(false, err); //res.json(err);
        console.log('after fetchFileSharingMongo files=', files);
        // res.json(files);
        cb(false, files);
      });
  },
};
