const mongoose = require('mongoose');
const File = require('../models/mongoose_file');

module.exports = {
  fetchFiles: (msg, cb) => {

    const req = msg;
    
    console.log('fetchFiles msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));
    console.log('---> path=', process.env.ROOT_FOLDER + req.decoded.email)

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
};
