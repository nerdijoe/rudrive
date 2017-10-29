const mongoose = require('mongoose');
const Activity = require('../models/mongoose_activity');

const db = require('../models');

// export const USER_SIGN_UP = 'USER_SIGN_UP';
// export const USER_SIGN_IN = 'USER_SIGN_IN';
// export const USER_SIGN_OUT = 'USER_SIGN_OUT';
// export const FETCH_USER_ABOUT = 'FETCH_USER_ABOUT';
// export const FETCH_USER_INTEREST = 'FETCH_USER_INTEREST';
// export const UPDATE_USER_ABOUT = 'UPDATE_USER_ABOUT';
// export const UPDATE_USER_INTEREST = 'UPDATE_USER_INTEREST';

// export const FETCH_LISTING = 'FETCH_LISTING';
// export const FETCH_FILES = 'FETCH_FILES';
// export const ADD_NEW_FILE = 'ADD_NEW_FILE';
// export const STAR_FILE = 'STAR_FILE';
// export const DELETE_FILE = 'DELETE_FILE';

// export const FETCH_FOLDERS = 'FETCH_FOLDERS';
// export const ADD_NEW_FOLDER = 'ADD_NEW_FOLDER';
// export const STAR_FOLDER = 'STAR_FOLDER';
// export const DELETE_FOLDER = 'DELETE_FOLDER';

// export const FETCH_CONTENTS_BY_FOLDER_ID = 'FETCH_CONTENTS_BY_FOLDER_ID';

// // Navigation Breadcrumb
// export const BREADCRUMB_PUSH = 'BREADCRUMB_PUSH';
// export const BREADCRUMB_POP = 'BREADCRUMB_POP';
// export const BREADCRUMB_CLEAR = 'BREADCRUMB_CLEAR';

// // Sharing
// export const FILE_SHARING_ADD = 'FILE_SHARING_ADD';
// export const FILE_SHARING_REMOVE = 'FILE_SHARING_REMOVE';
// export const FETCH_SHARE_FILES = 'FETCH_SHARE_FILES';

// export const FOLDER_SHARING_ADD = 'FOLDER_SHARING_ADD';
// export const FOLDER_SHARING_REMOVE = 'FOLDER_SHARING_REMOVE';
// export const FETCH_SHARE_FOLDERS = 'FETCH_SHARE_FOLDERS';

exports.insertActivity = (req, res) => {
  console.log('insertActivity req.decoded._id=', req.decoded._id)
  const data = req.body;
  console.log('req.body', data);

  // action
  // description
  // user_id

  db.Activity.create({
    action: data.action,
    description: data.description,
    user_id: req.decoded._id,
  }).then((item) => {
    console.log('activity inserted', item);
    res.json(item);
  });
};

exports.fetchActivities = (req, res) => {
  console.log('fetchActivities', req.decoded._id);

  db.Activity.findAll({
    where: {
      user_id: req.decoded._id,
    },
    order: [['createdAt', 'ASC']],
  }).then((activities) => {
    console.log('after fetchActivities activities=', activities);
    res.json(activities);
  });
};


//---------- MongoDb
exports.insertActivityMongo = (req, res) => {
  console.log('insertActivityMongo req.decoded._id=', req.decoded._id)
  const data = req.body;
  console.log('req.body', data);

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
    res.json(item);
  });
};

exports.fetchActivitiesMongo = (req, res) => {
  console.log('fetchActivities', req.decoded._id);

  Activity
    .find({
      user: mongoose.Types.ObjectId(req.decoded._id),
    })
    .sort({
      createdAt: 'desc',
    })
    .exec((err, activities) => {
      console.log('after fetchActivitiesMongo activities=', activities);
      res.json(activities);
    });
};
