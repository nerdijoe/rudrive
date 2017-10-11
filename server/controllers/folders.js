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

exports.fetchById = (req, res) => {
  console.log('fetchByPath', req.decoded._id);
  console.log('fetchByPath req.params.id=', req.params.id);

  db.Folder.findOne({
    where: {
      user_id: req.decoded._id,
      id: req.params.id,
    },
  }).then((folder) => {
    console.log('after fetchByPath folders=', folder);

    // after get the folder, we need to get the contents of this folder
    db.Folder.findAll({
      where: {
        user_id: req.decoded._id,
        path: folder.full_path,
      },
    }).then((folders) => {
      console.log(`----> folders in '${folder.full_path}'`, folders);

      // res.json(folders);

      db.File.findAll({
        where: {
          user_id: req.decoded._id,
          path: folder.full_path,
        },
      }).then((files) => {
        console.log(`----> files in '${folder.full_path}'`, files);

        res.json({
          files,
          folders,
        });
      });


    });

    // res.json(folder);
  });
};
