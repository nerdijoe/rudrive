const User = require('../models/user');

exports.getAll = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.json(err);
    } else {
      res.json(users);
    }
  });
};
