const mongoose = require('mongoose');
const User = require('../models/mongoose_user');
const About = require('../models/mongoose_about');
const Interest = require('../models/mongoose_interest');
const Activity = require('../models/mongoose_activity');

module.exports = {
  fetchAbout: (msg, cb) => {
    const req = msg;

    console.log('fetchAbout msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    About.findOne({
      user: mongoose.Types.ObjectId(req.decoded._id),
    }, (err, about) => {
      console.log('getAbout', about);
      if (!about) {
        console.log('--------> about null');
        about = {
          overview: '',
          work: '',
          education: '',
          contact_info: '',
          life_events: '',
        };
      }

      // res.json(about);
      cb(false, about);
    });
  },
  updateAbout: (msg, cb) => {
    const req = msg;

    console.log('updateAbout msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));
    
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
      // res.json(updatedAbout);
      cb(false, updatedAbout);
    });
  },
  fetchInterest: (msg, cb) => {
    const req = msg;

    console.log('fetchInterest msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

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
      // res.json(interest);
      cb(false, interest);
    });
  },
  updateInterest: (msg, cb) => {
    const req = msg;
    const interest = req.body;
    
    console.log('updateAbout msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));
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
      // res.json(updatedInterest);
      cb(false, updatedInterest);
    });
  },
  insertActivity: (msg, cb) => {
    const req = msg;

    console.log('insertActivity msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));
    const data = req.body;
    // action
    // description
    // user
    const newActivity = Activity({
      action: data.action,
      description: data.description,
      user: mongoose.Types.ObjectId(req.decoded._id),
    });

    newActivity.save((err, item) => {
      console.log('activity inserted', item);
      // res.json(item);
      cb(false, item);
    });
  },
  fetchActivities: (msg, cb) => {
    const req = msg;

    console.log('fetchActivities msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));
    
    Activity
      .find({
        user: mongoose.Types.ObjectId(req.decoded._id),
      })
      .sort({
        createdAt: 'desc',
      })
      .exec((err, activities) => {
        console.log('after fetchActivities activities.length=', activities.length);
        // res.json(activities);
        cb(false, activities);
      });

  },

};
