const mongoose = require('mongoose');
const db = require('../models');
const File = require('../models/mongoose_file');
const User = require('../models/mongoose_user');
const kafka = require('../routes/kafka/client');
const action = require('../helpers/actionConstants');

exports.fetchFiles = (req, res) => {
  console.log('fetchFiles', req.decoded._id);

  db.File.findAll({
    where: {
      user_id: req.decoded._id,
    },
  }).then((files) => {
    console.log('after fetchFiles files=', files);

    res.json(files);
  });
};

exports.fetchRootFiles = (req, res) => {
  console.log('fetchRootFiles', req.decoded._id);

  db.File.findAll({
    where: {
      user_id: req.decoded._id,
      path: process.env.ROOT_FOLDER + req.decoded.email,
    }
  }).then((files) => {
    console.log('after fetchRootFiles files=', files);

    res.json(files);
  });
};

exports.fetchRootFilesWithShare = (req, res) => {
  console.log('fetchRootFilesWithShare', req.decoded._id);

  db.File.findAll({
    where: {
      user_id: req.decoded._id,
      path: process.env.ROOT_FOLDER + req.decoded.email,
    },
    include: [{ model: db.User }],
  }).then((files) => {
    // console.log('after fetchRootFilesWithShare files=', files);

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
    .then((updatedFile) => {
      console.log('after starFile updatedFile=', updatedFile);
      if (updatedFile[0] === 1) {
        console.log("file is starred successfully");
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch((err) => {
      console.log(err);
    });
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

exports.fetchFilesMongo = (req, res) => {
  console.log('fetchFilesMongo', req.decoded._id);

  File.find({
    user: mongoose.Types.ObjectId(req.decoded._id),
  }, (err, files) => {
    console.log('after fetchFilesMongo files=', files);

    res.json(files);
  });
};

exports.fetchRootFilesMongo = (req, res) => {
  console.log('fetchRootFilesMongo', req.decoded._id);

  File
    .find({
      user: mongoose.Types.ObjectId(req.decoded._id),
      path: process.env.ROOT_FOLDER + req.decoded.email,
    })
    .populate('user')
    .exec((err, files) => {
      console.log('after fetchRootFilesMongo files=', files);

      res.json(files);
    });
};

exports.fetchRootFilesWithShareMongo = (req, res) => {
  console.log('fetchRootFilesWithShareMongo', req.decoded._id);

  File
    .find({
      user: mongoose.Types.ObjectId(req.decoded._id),
      path: process.env.ROOT_FOLDER + req.decoded.email,
    })
    .populate('user')
    .populate('users')
    .exec((err, files) => {
      console.log('after fetchRootFilesWithShareMongo files=', files);

      res.json(files);
    });
};

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

exports.deleteFileMongo = (req, res) => {
  console.log('deleteFileMongo', req.decoded._id);
  console.log('req.body', req.body);
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
        res.json(true);
      } else {
        res.json(false);
      }
    }
  );
};

exports.addFileSharingMongo = (req, res) => {
  console.log('addFileSharing', req.decoded._id);
  console.log('req.body=', req.body);

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
        if (err3) res.json(err3);
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
            if (err4) res.json(err4);
            res.json(file);
          });
      });
    });
  });
};

exports.removeFileSharingMongo = (req, res) => {
  console.log('removeFileSharingMongo', req.decoded._id);
  console.log('req.body=', req.body);

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
          if (err) res.json(err);
          res.json({ msg: 'Remove file share is successful.' });
        });
      } else {
        res.json({ msg: 'error' });
      }
    }
  );
};

exports.fetchFileSharingMongo = (req, res) => {
  console.log('fetchFileSharingMongo', req.decoded._id);

  File
    .find({
      users:  mongoose.Types.ObjectId(req.decoded._id),
    })
    .populate('user')
    .populate('users')
    .exec((err, files) => {
      if (err) res.json(err);
      console.log('after fetchFileSharingMongo files=', files);
      res.json(files);
    });
};

// Kafka -----------------------

exports.fetchRootFilesWithShareMongoKafka = (req, res) => {
  console.log('fetchRootFilesWithShareMongoKafka', req.decoded._id);

  kafka.make_request('request_topic', { action: action.FETCH_FILES, decoded: req.decoded }, (err, results) => {
    console.log('after request fetchRootFilesWithShareMongoKafka');
    console.log('   results=', results);
    if (err) {
      console.log('  ----> fetchRootFilesWithShareMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.starFileMongoKafka = (req, res) => {
  console.log('starFileMongoKafka', req.decoded._id);

  kafka.make_request('request_topic', {
    action: action.STAR_FILE,
    body: req.body,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('starFileMongoKafka');
    console.log('   results=', results);
    if (err) {
      console.log('  ----> starFileMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.deleteFileMongoKafka = (req, res) => {
  console.log('deleteFileMongoKafka', req.decoded._id);
  console.log('req.body', req.body);

  kafka.make_request('request_topic', {
    action: action.DELETE_FILE,
    body: req.body,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('deleteFileMongoKafka');
    console.log('   results=', results);
    if (err) {
      console.log('  ----> deleteFileMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.addFileSharingMongoKafka = (req, res) => {
  console.log('addFileSharingMongoKafka', req.decoded._id);
  console.log('req.body=', req.body);

  kafka.make_request('request_topic', {
    action: action.FILE_SHARING_ADD,
    body: req.body,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('addFileSharingMongoKafka');
    console.log('   results=', results);
    if (err) {
      console.log('  ----> addFileSharingMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.removeFileSharingMongoKafka = (req, res) => {
  console.log('removeFileSharingMongoKafka', req.decoded._id);
  console.log('req.body=', req.body);

  kafka.make_request('request_topic', {
    action: action.FILE_SHARING_REMOVE,
    body: req.body,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('removeFileSharingMongoKafka');
    console.log('   results=', results);
    if (err) {
      console.log('  ----> removeFileSharingMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.fetchFileSharingMongoKafka = (req, res) => {
  console.log('fetchFileSharingMongoKafka', req.decoded._id);

  kafka.make_request('request_topic', {
    action: action.FETCH_SHARE_FILES,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('fetchFileSharingMongoKafka');
    console.log('   results=', results);
    if (err) {
      console.log('  ----> fetchFileSharingMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};
