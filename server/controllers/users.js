const mongoose = require('mongoose');
const About = require('../models/mongoose_about');
const Interest = require('../models/mongoose_interest');
const kafka = require('../routes/kafka/client');
const action = require('../helpers/actionConstants');

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


// --- Mongo

exports.getAboutMongo = (req, res) => {
  console.log('getAbout req.decoded._id=', req.decoded._id);
  About.findOne({
    user: mongoose.Types.ObjectId(req.decoded._id),
  }, (err, about) => {
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

exports.updateAboutMongo = (req, res) => {
  console.log('updateAbout req.decode._id=', req.decoded._id);
  console.log('updateAbout req.body=', req.body);
  const about = req.body;

  // format date to ISO
  const d = new Date();
  const n = d.toISOString();
  console.log('*** formatted date =', n);

  About.update({
    user: mongoose.Types.ObjectId(req.decoded._id),
  }, {
    $set: {
      overview: about.overview,
      work: about.work,
      education: about.education,
      contact_info: about.contact_info,
      life_events: about.life_events,
      updatedAt: n,
    },
  }, (err, updatedAbout) => {
    console.log('after updateAboutMongo updatedAbout=', updatedAbout);
    res.json(updatedAbout);
  });
};

exports.getInterestMongo = (req, res) => {
  console.log('getInterest req.decode._id=', req.decoded._id);

  Interest.findOne({
    user: mongoose.Types.ObjectId(req.decoded._id),
  }, (err, interest) => {
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

exports.updateInterestMongo = (req, res) => {
  console.log('updateInterestMongo req.decode._id=', req.decoded._id);
  console.log('updateInterestMongo req.body=', req.body);
  const interest = req.body;

  // format date to ISO
  const d = new Date();
  const n = d.toISOString();
  // console.log('*** formatted date =', n);

  Interest.update({
    user: mongoose.Types.ObjectId(req.decoded._id),
  }, {
    $set: {
      music: interest.music,
      shows: interest.shows,
      sports: interest.sports,
      fav_teams: interest.fav_teams,
      updatedAt: n,
    },
  }, (err, updatedInterest) => {
    console.log('after updateInterestMongo updatedAbout=', updatedInterest);
    res.json(updatedInterest);
  });
};

// ===== kafka

exports.getAboutMongoKafka = (req, res) => {
  console.log('getAbout req.decoded._id=', req.decoded._id);

  kafka.make_request('request_topic', { action: action.FETCH_USER_ABOUT, decoded: req.decoded }, (err, results) => {
    console.log('getAboutMongoKafka');
    // console.log('   results=', results);
    if (err) {
      console.log('  ----> getAboutMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.updateAboutMongoKafka = (req, res) => {
  console.log('updateAboutMongoKafka req.decode._id=', req.decoded._id);
  console.log('updateAboutMongoKafka req.body=', req.body);

  kafka.make_request('request_topic', {
    action: action.UPDATE_USER_ABOUT,
    body: req.body,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('updateAboutMongoKafka');
    // console.log('   results=', results);
    if (err) {
      console.log('  ----> updateAboutMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.getInterestMongoKafka = (req, res) => {
  console.log('getInterestMongoKafka req.decode._id=', req.decoded._id);

  kafka.make_request('request_topic', {
    action: action.FETCH_USER_INTEREST,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('getInterestMongoKafka');
    // console.log('   results=', results);
    if (err) {
      console.log('  ----> getInterestMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

exports.updateInterestMongoKafka = (req, res) => {
  console.log('updateInterestMongoKafka req.decode._id=', req.decoded._id);
  console.log('updateInterestMongoKafka req.body=', req.body);

  kafka.make_request('request_topic', {
    action: action.UPDATE_USER_INTEREST,
    body: req.body,
    decoded: req.decoded,
  }, (err, results) => {
    console.log('updateInterestMongoKafka');
    // console.log('   results=', results);
    if (err) {
      console.log('  ----> updateInterestMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });
};
