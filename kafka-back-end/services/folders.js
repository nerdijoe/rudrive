const mongoose = require('mongoose');
const Folder = require('../models/mongoose_folder');

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
};
