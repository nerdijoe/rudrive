// const User = require('../models/user');

// exports.getAll = (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) {
//       res.json(err);
//     } else {
//       res.json(users);
//     }
//   });
// };

const db = require('../models');

exports.getAbout = (req, res) => {
  console.log('getAbout req.decode._id=', req.decoded._id);
  db.About.findOne({
    where: {
      user_id: req.decoded._id,
    }
  }).then( about => {
    console.log('getAbout', about);
    if (!about) {
      about = {
        overview: '',
        work_edu: '',
        contact_info: '',
        life_events: '',
      };
    }
    
    res.json(about);
  })
}
