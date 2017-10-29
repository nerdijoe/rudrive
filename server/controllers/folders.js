const mongoose = require('mongoose');
const Folder = require('../models/mongoose_folder');
const File = require('../models/mongoose_file');
const User = require('../models/mongoose_user');

const db = require('../models');
require('dotenv').config();

exports.fetchFolders = (req, res) => {
  console.log('fetchFolders', req.decoded._id);

  db.Folder.findAll({
    where: {
      user_id: req.decoded._id,
    }
  }).then((folders) => {
    console.log('after fetchFolders folders=', folders);

    res.json(folders);
  });
};

exports.fetchRootFolders = (req, res) => {
  console.log('fetchRootFolder', req.decoded._id);

  db.Folder.findAll({
    where: {
      user_id: req.decoded._id,
      path: process.env.ROOT_FOLDER + req.decoded.email,
    }
  }).then((folders) => {
    // console.log('after fetchRootFolder folders=', folders);

    res.json(folders);
  });
};

exports.fetchRootFoldersWithShare = (req, res) => {
  console.log('fetchRootFoldersWithShare', req.decoded._id);

  // db.Folder.findAll({
  //   where: {
  //     user_id: req.decoded._id,
  //     path: process.env.ROOT_FOLDER + req.decoded.email,
  //   },
  //   include: [{ model: db.User }],
  // }).then((folders) => {
  //   // console.log('after fetchRootFolder folders=', folders);

  //   res.json(folders);
  // });

  Folder
    .find({
      user: mongoose.Types.ObjectId(req.decoded._id),
      path: process.env.ROOT_FOLDER + req.decoded.email,
    })
    .populate('user')
    .populate('users')
    .exec((err, folders) => {
      console.log('after fetchRootFolder folders=', folders);

      res.json(folders);
    });
};


exports.starFolder = (req, res) => {
  console.log('starFile', req.decoded._id);
  const folder = req.body;
  console.log(`typeof folder.is_starred=${typeof folder.is_starred}`);
 
  const star_status = (folder.is_starred == 'true');
  console.log(`starFile is_starred=${folder.is_starred}, star_status = ${star_status}, typeof ${typeof star_status}`);

  db.Folder.update({ 
    is_starred: !folder.is_starred,
  }, {
    where: { id: folder.id },
  })
    .then(updatedFolder => {
      console.log('after starFolder updatedFolder=', updatedFolder);
      if(updatedFolder[0] === 1)
      {
        console.log("folder is starred successfully");
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch(err => {
      console.log(err);
    })
};

exports.deleteFolder = (req, res) => {
  console.log('deleteFolder', req.decoded._id);
  console.log('req.body', req.body);
  const folder = req.body;
  console.log(`typeof folder.is_deleted=${typeof folder.is_deleted}`);

  const delete_status = (folder.is_deleted == 'true');
  console.log(`deleteFolder is_deleted=${folder.is_deleted}, delete_status = ${delete_status}, typeof ${typeof delete_status}`);

  // !folder.is_deleted
  db.Folder.update({ 
    is_deleted: !folder.is_deleted,
  }, {
    where: { id: folder.id },
  })
    .then((updatedFolder) => {
      console.log('after deleteFolder updatedFolder=', updatedFolder);
      if (updatedFolder[0] === 1) {
        console.log(`folder [${folder.name}]is deleted successfully`);
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch((err) => {
      console.log(err);
    });
};


exports.fetchById = (req, res) => {
  console.log('fetchByPath', req.decoded._id);
  console.log('fetchByPath req.params.id=', req.params.id);

  db.Folder.findOne({
    where: {
      // user_id: req.decoded._id,
      id: req.params.id,
    },
  }).then((folder) => {
    console.log('after fetchByPath folders=', folder);
    if (folder) {
      // after get the folder, we need to get the contents of this folder
      db.Folder.findAll({
        where: {
          // user_id: req.decoded._id,
          path: folder.full_path,
        },
        include: [{ model: db.User }],
      }).then((folders) => {
        console.log(`----> folders in '${folder.full_path}'`, folders);

        // res.json(folders);

        db.File.findAll({
          where: {
            // user_id: req.decoded._id,
            path: folder.full_path,
          },
          include: [{ model: db.User }],
        }).then((files) => {
          console.log(`----> files in '${folder.full_path}'`, files);

          res.json({
            files,
            folders,
          });
        });
      });
    } else {
      res.json({
        msg: 'folder id is invalid.'
      });
    }
    // res.json(folder);
  });
};

exports.addFolderSharing = (req, res) => {
  console.log('addFolderSharing', req.decoded._id);
  console.log('req.body=', req.body);

  let users = req.body.users.split(/[,]\s/);
  console.log('users=', users);
  let folder_id = req.body.folder_id;

  db.User.findAll({
    where: {
      email: users,
    },
  }).then((fetchedUsers) => {
    console.log('fetchUsers', fetchedUsers);


    let bulkContent = fetchedUsers.map((i) => {
      return { user_id: i.id, folder_id: folder_id };
    });

    console.log('bulkContent', bulkContent);
    db.FolderSharing.bulkCreate(bulkContent)
      .then(() => {

        // db.FileSharing.findAll({
        //   where: {
        //     file_id: file_id,
        //   }
        // }).then((finalResult) => {
        //   console.log('finalResult', finalResult);
        //   res.json(finalResult);
        // });

        // db.File.getUsers({
        //   where: {
        //     id: file_id,
        //   },
        // }).then((shareInfo) => {
        //   console.log('shareInfo', shareInfo);
        //   res.json(shareInfo);
        // });

        db.Folder.findAll({
          where: { id: folder_id },
          include: [{ model: db.User }],
        }).then((shareInfo) => {
          console.log('shareInfo', shareInfo);
          res.json(shareInfo);
        });

      });
  });

  // res.json('addFileSharing');
}

exports.removeFolderSharing = (req, res) => {
  console.log('removeFolderSharing', req.decoded._id);
  console.log('req.body=', req.body);

  db.FolderSharing.destroy({
    where: {
      user_id: req.body.user_id,
      folder_id: req.body.folder_id,
    },
  }).then((rowDeleted) => {
    if (rowDeleted === 1) {
      res.json({ msg: 'Remove folder share is successful.' });
    } else {
      res.json({ msg: 'error' });
    }
  });
};


exports.fetchFolderSharing = (req, res) => {
  console.log('fetchFolderSharing', req.decoded._id);

  db.User.findOne({
    where: {
      id: req.decoded._id,
    },
    include: [{ model: db.Folder }],
  }).then((user) => {

    if (!user) {
      res.json([]);
    } else {
      console.log('after fetchFolderSharing user=', user.dataValues);
      // only return the files array that have been shared to the signed in user.
      res.json(user.Folders);
    }
  });
};


// MongoDB ---------------------------------------------------------------

exports.starFolderMongo = (req, res) => {
  console.log('starFolderMongo', req.decoded._id);
  const folder = req.body;
  console.log(`typeof folder.is_starred=${typeof folder.is_starred}`);
 
  let star_status = folder.is_starred;
  if ((typeof folder.is_starred) !== 'boolean') {
    star_status = (folder.is_starred === 'true');
  }
  console.log(`starFolderMongo is_starred=${folder.is_starred}, star_status = ${star_status}, typeof ${typeof star_status}`);

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
      console.log('after starFolderMongo result=', result);
      if (result.nModified === 1) {
        console.log("folder is starred successfully");
        res.json(true);
      } else {
        res.json(false);
      }
    }
  );
};

exports.deleteFolderMongo = (req, res) => {
  console.log('deleteFolderMongo', req.decoded._id);
  console.log('req.body', req.body);
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
      if (result.nModified === 1) {
        console.log(`folder [${folder.name}]is deleted successfully`);
        res.json(true);
      } else {
        res.json(false);
      }
    }
  );
};

exports.fetchByIdMongo = (req, res) => {
  console.log('fetchByIdMongo', req.decoded._id);
  console.log('fetchByIdMongo req.params.id=', req.params.id);

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
              res.json({
                files,
                folders,
              });
            });
        });
    } else {
      res.json({
        msg: 'folder id is invalid',
      });
    }
  });
};

exports.addFolderSharingMongo = (req, res) => {
  console.log('addFolderSharingMongo', req.decoded._id);
  console.log('req.body=', req.body);

  let users = req.body.users.split(/[,]\s/);
  console.log('users=', users);
  let folder_id = mongoose.Types.ObjectId(req.body.folder_id);

  User.find({
    email: {
      $in: users,
    },
  }, (err, fetchedUsers) => {
    // fetch the file
    Folder.findById(folder_id, (err2, fetchedFolder) => {
      fetchedUsers.map((user) => {
        fetchedFolder.users.push(user._id);
      });

      fetchedFolder.save((err3, savedFolder) => {
        if (err3) res.json(err3);
        console.log('***** savedFolder', savedFolder);

        savedFolder
          .populate({
            path: 'users',
            model: 'User',
          })
          .populate({
            path: 'user',
            model: 'User',
          }, (err4, folder) => {
            if (err4) res.json(err4);
            res.json(folder);
          });
      });
    });
  });
};


exports.removeFolderSharingMongo = (req, res) => {
  console.log('removeFolderSharingMongo', req.decoded._id);
  console.log('req.body=', req.body);

  const user_id = mongoose.Types.ObjectId(req.body.user_id);
  const folder_id = mongoose.Types.ObjectId(req.body.folder_id);

  Folder.findById(
    folder_id,
    (err, folder) => {
      // console.log(' **** file.users[0]', file.users[0]);
      // console.log(`typeof user_id=`, typeof user_id);
      // console.log(`typeof file.users[0]= ${typeof file.users[0]}`);
      // const pos = file.users.findIndex(i => i === file_id);
      const pos = folder.users.indexOf(user_id);
      // console.log('******* pos=', pos);      
      if (pos !== -1) {
        folder.users.splice(pos, 1);
        folder.save((err, savedFolder) => {
          // console.log('******* savedFile=', savedFile);
          if (err) res.json(err);
          res.json({ msg: 'Remove folder share is successful.' });
        });
      } else {
        res.json({ msg: 'error' });
      }
    }
  );
};


exports.fetchFolderSharingMongo = (req, res) => {
  console.log('fetchFolderSharingMongo', req.decoded._id);

  Folder
    .find({
      users:  mongoose.Types.ObjectId(req.decoded._id),
    })
    .populate('users')
    .populate('users')
    .exec((err, folders) => {
      if (err) res.json(err);
      console.log('after fetchFolderSharingMongo folders=', folders);
      res.json(folders);
    });
};

