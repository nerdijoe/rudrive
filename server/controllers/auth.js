const User = require('../models/user');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res, next) => {
  const data = req.body;
  data.password = passwordHash.generate(req.body.password);

  User.create( data, (err, user) => {
    if (err) {
      res.json(err);
    } else {
      res.json(user);
    }
  });
};
