const mongoose = require('mongoose');
const db = require('../models');
const File = require('../models/mongoose_file');

exports.fetchFiles = (req, res) => {
  console.log('fetchFiles', req.decoded._id);

  db.File.findAll({
    where: {
      user_id: req.decoded._id,
    }
  }).then ( files => {
    console.log('after fetchFiles files=', files);

    res.json(files);
  })
};

exports.fetchRootFiles = (req, res) => {
  console.log('fetchRootFiles', req.decoded._id);

  // db.File.findAll({
  //   where: {
  //     user_id: req.decoded._id,
  //     path: process.env.ROOT_FOLDER + req.decoded.email,
  //   }
  // }).then((files) => {
  //   console.log('after fetchRootFiles files=', files);

  //   res.json(files);
  // });

  File
    .find({
      user: mongoose.Types.ObjectId(req.decoded._id),
      path: process.env.ROOT_FOLDER + req.decoded.email,
    })
    .populate('user')
    .exec((err, files) => {
      console.log('after fetchRootFiles files=', files);

      res.json(files);
    });
};

exports.fetchRootFilesWithShare = (req, res) => {
  console.log('fetchRootFilesWithShare', req.decoded._id);

  // db.File.findAll({
  //   where: {
  //     user_id: req.decoded._id,
  //     path: process.env.ROOT_FOLDER + req.decoded.email,
  //   },
  //   include: [{ model: db.User }],
  // }).then((files) => {
  //   // console.log('after fetchRootFilesWithShare files=', files);

  //   res.json(files);
  // });

  File
    .find({
      user: mongoose.Types.ObjectId(req.decoded._id),
      path: process.env.ROOT_FOLDER + req.decoded.email,
    })
    .populate('user')
    .exec((err, files) => {
      console.log('after fetchRootFilesWithShare files=', files);

      res.json(files);
    });

};

exports.starFile = (req, res) => {
  console.log('starFile', req.decoded._id);
  const file = req.body;
  console.log(`typeof file.is_starred=${typeof file.is_starred}`);
 
  const star_status = (file.is_starred == 'true');
  console.log(`starFile is_starred=${file.is_starred}, star_status = ${star_status}, typeof ${typeof star_status}`);

  db.File.update({ 
    is_starred: !file.is_starred,
  }, {
    where: { id: file.id },
  })
    .then(updatedFile => {
      console.log('after starFile updatedFile=', updatedFile);
      if(updatedFile[0] === 1)
      {
        console.log("file is starred successfully");
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch(err => {
      console.log(err);
    })
};

exports.deleteFile = (req, res) => {
  console.log('deleteFile', req.decoded._id);
  console.log('req.body', req.body);
  const file = req.body;
  console.log(`typeof file.is_deleted=${typeof file.is_deleted}`);

  const delete_status = (file.is_deleted == 'true');
  console.log(`starFile is_deleted=${file.is_deleted}, delete_status = ${delete_status}, typeof ${typeof delete_status}`);

  // !file.is_deleted
  db.File.update({ 
    is_deleted: !file.is_deleted,
  }, {
    where: { id: file.id },
  })
    .then((updatedFile) => {
      console.log('after deleteFile updatedFile=', updatedFile);
      if (updatedFile[0] === 1) {
        console.log(`file [${file.name}]is deleted successfully`);
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch((err) => {
      console.log(err);
    });
};

// add users for file sharing
exports.addFileSharing = (req, res) => {
  console.log('addFileSharing', req.decoded._id);
  console.log('req.body=', req.body);

  let users = req.body.users.split(/[,]\s/);
  console.log('users=', users);
  let file_id = req.body.file_id;

  db.User.findAll({
    where: {
      email: users,
    },
  }).then((fetchedUsers) => {
    console.log('fetchUsers', fetchedUsers);


    let bulkContent = fetchedUsers.map((i) => {
      return { user_id: i.id, file_id: file_id };
    });

    console.log('bulkContent', bulkContent);
    db.FileSharing.bulkCreate(bulkContent)
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

        db.File.findAll({
          where: { id: file_id },
          include: [{ model: db.User }],
        }).then((shareInfo) => {
          console.log('shareInfo', shareInfo);
          res.json(shareInfo);
        });

      });
  });

  // res.json('addFileSharing');
}

exports.removeFileSharing = (req, res) => {
  console.log('removeFileSharing', req.decoded._id);
  console.log('req.body=', req.body);

  db.FileSharing.destroy({
    where: {
      user_id: req.body.user_id,
      file_id: req.body.file_id,
    },
  }).then((rowDeleted) => {
    if (rowDeleted === 1) {
      res.json({ msg: 'Remove file share is successful.' });
    } else {
      res.json({ msg: 'error' });
    }
  });
};

exports.fetchFileSharing = (req, res) => {
  console.log('fetchFileSharing', req.decoded._id);

  db.User.findOne({
    where: {
      id: req.decoded._id,
    },
    include: [{ model: db.File }],
  }).then((user) => {
    if (!user) {
      res.json([]);
    } else {
      console.log('after fetchFileSharing user=', user.dataValues);

      // only return the files array that have been shared to the signed in user.
      res.json(user.Files);
    }
  });
};


// MongoDB ---------------------------------------------------------------

exports.starFileMongo = (req, res) => {
  console.log('starFile', req.decoded._id);
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
        res.json(true);
      } else {
        res.json(false);
      }
    }
  );
};

