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
    // console.log('getAbout', about);
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



exports.updateAbout = (req, res) => {
  console.log('updateAbout req.decode._id=', req.decoded._id);
  console.log('updateAbout req.body=', req.body);
  const about = req.body;
  db.About.update({ 
    overview: about.overview,
    work: about.work,
    education: about.education,
    contact_info: about.contact_info,
    life_events: about.life_events,
  },
    { where: { user_id: req.decoded._id } }
  )
    .then(updatedAbout => {
      console.log('after updateAbout updatedAbout=', updatedAbout);
      if(updatedAbout[0] === 1)
      {
        console.log("update About successful");
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch(err => {
      console.log(err);
    })
}
