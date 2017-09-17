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

exports.signin = (req, res) => {
  // req.user is passed from passport
  const user = req.user;
  console.log('auth.signin');
  console.log(user);

  const email = req.user.email;
  const token = jwt.sign({
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    _id: req.user._id,
  }, process.env.JWT_KEY);

  res.send({ token, email, _id: req.user._id });
};
