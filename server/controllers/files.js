const db = require('../models');

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
