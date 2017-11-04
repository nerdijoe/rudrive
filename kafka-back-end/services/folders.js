const mongoose = require('mongoose');
const Folder = require('../models/mongoose_folder');
const File = require('../models/mongoose_file');

module.exports = {
  fetchRootFoldersWithShare: (msg, cb) => {
    const req = msg;

    console.log('fetchRootFoldersWithShare msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    Folder
      .find({
        user: mongoose.Types.ObjectId(req.decoded._id),
        path: process.env.ROOT_FOLDER + req.decoded.email,
      })
      .populate('user')
      .populate('users')
      .exec((err, folders) => {
        console.log('after fetchRootFoldersWithShare folders=', folders);

        // res.json(folders);
        cb(false, folders);
      });
  },
  starFolder: (msg, cb) => {
    const req = msg;

    console.log('starFolder msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const folder = req.body;
    console.log(`typeof folder.is_starred=${typeof folder.is_starred}`);
   
    let star_status = folder.is_starred;
    if ((typeof folder.is_starred) !== 'boolean') {
      star_status = (folder.is_starred === 'true');
    }
    console.log(`starFolderMongoKafka is_starred=${folder.is_starred}, star_status = ${star_status}, typeof ${typeof star_status}`);
  
    // format date to ISO
    const d = new Date();
    const n = d.toISOString();
  
    Folder.findByIdAndUpdate(
      folder._id,
      {
        $set: {
          is_starred: !star_status,
          updatedAt: n,
        },
      },
      (err, result) => {
        console.log('after starFolderMongoKafka result=', result);
        if (result.nModified === 1) {
          console.log("folder is starred successfully");
          // res.json(true);
          cb(false, true);
        } else {
          // res.json(false);
          cb(false, false);
        }
      }
    );
  },
  deleteFolder: (msg, cb) => {
    const req = msg;

    console.log('starFolder msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const folder = req.body;
    console.log(`typeof folder.is_deleted=${typeof folder.is_deleted}`);
  
    let delete_status = folder.is_deleted;
    if ((typeof folder.is_deleted) !== 'boolean') {
      delete_status = (folder.is_deleted === 'true');
    }
    console.log(`deleteFolder is_deleted=${folder.is_deleted}, delete_status = ${delete_status}, typeof ${typeof delete_status}`);
  
    // format date to ISO
    const d = new Date();
    const n = d.toISOString();
  
    Folder.findByIdAndUpdate(
      folder._id,
      {
        $set: {
          is_deleted: !delete_status,
          updatedAt: n,
        },
      },
      (err, result) => {
        console.log('after deleteFolderMongo result=', result);
  
        // need to delete all the folders and files inside this folder
        const formatted_path = result.full_path.replace(/\//g, '\\/');
        console.log('**** formatted_path=', formatted_path);
  
        Folder.update({
          path: new RegExp('^(' + formatted_path + ')'),
        }, {
          $set: {
            is_deleted: true,
            updatedAt: n,
          },
        }, {
          "multi": true,
        }, (err, folders) => {
          console.log('**** deleted sub folders=', folders)
  
          File.update({
            path: new RegExp('^(' + formatted_path + ')'),
          }, {
            $set: {
              is_deleted: true,
              updatedAt: n,
            },
          }, {
            "multi": true,
          }, (err, files) => {
            // res.json(files);
            cb(false, files);
          });
        });
      }
    );    
  },
  fetchById: (msg, cb) => {
    const req = msg;

    console.log('starFolder msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    Folder.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    }, (err, folder) => {
      console.log('after finding folder', folder);

      if (folder) {
        Folder
          .find({
            path: folder.full_path,
          })
          .populate('user')
          .populate('users')
          .exec((err2, folders) => {
            console.log('getting the content of folder, folders', folders);

            File
              .find({
                path: folder.full_path,
              })
              .populate('user')
              .populate('users')
              .exec((err3, files) => {
                console.log('getting the content of folder, files', files);

                // res.json({
                //   files,
                //   folders,
                // });
                cb(false, {
                  files,
                  folders,
                });
              });
          });
      } else {
        // res.json({
        //   msg: 'folder id is invalid',
        // });

        cb(false, {
          msg: 'folder id is invalid',
        });
      }
    });
  },

};
