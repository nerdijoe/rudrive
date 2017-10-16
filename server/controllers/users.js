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
      console.log('--------> about null');
      about = {
        overview: '',
        work_edu: '',
        contact_info: '',
        life_events: '',
      };
    }

    res.json(about);
  });
};



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
};


exports.getInterest = (req, res) => {
  console.log('getInterest req.decode._id=', req.decoded._id);
  db.Interest.findOne({
    where: {
      user_id: req.decoded._id,
    }
  }).then( interest => {
    // console.log('getAbout', about);
    if (!interest) {
      interest = {
        music: '',
        shows: '',
        sports: '',
        fav_teams: '',
      };
    }

    res.json(interest);
  });
};


exports.updateInterest = (req, res) => {
  console.log('updateInterest req.decode._id=', req.decoded._id);
  console.log('updateInterest req.body=', req.body);
  const interest = req.body;
  db.Interest.update({ 
    music: interest.music,
    shows: interest.shows,
    sports: interest.sports,
    fav_teams: interest.fav_teams,
  },
    { where: { user_id: req.decoded._id } }
  )
    .then(updatedInterest => {
      console.log('after updateInterest updatedInterest=', updatedInterest);
      if(updatedInterest[0] === 1)
      {
        console.log("update Interest successful");
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch(err => {
      console.log(err);
    })
};
