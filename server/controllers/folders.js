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
