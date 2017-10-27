const mongoose = require('mongoose');
const Folder = require('../models/mongoose_folder');
const File = require('../models/mongoose_file');

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

