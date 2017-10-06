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
