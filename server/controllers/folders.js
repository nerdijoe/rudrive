const db = require('../models');

exports.fetchFolders = (req, res) => {
  console.log('fetchFolders', req.decoded._id);

  db.Folder.findAll({
    where: {
      user_id: req.decoded._id,
    }
  }).then ( folders => {
    console.log('after fetchFolders folders=', folders);

    res.json(folders);
  })

  
}
