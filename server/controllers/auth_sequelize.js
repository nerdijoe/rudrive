const db = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res, next) => {
  // console.log(req);

  db.User.findOne({
    where: {
      email: req.body.email,
    }
  }).then ( user => {
    if (user) {
      res.json({message: 'Email is already taken.'});
    }
    else {
      const new_user = req.body;
      new_user.password = passwordHash.generate(new_user.password);
      
      db.User.create(new_user)
      .then( user => {
        console.log(`created user`, user);
        // res.json(user);

        // need to create a new entry in the about table
        const new_about = {
          overview: '',
          work_edu: '',
          contact_info: '',
          life_events: '',
          user_id: user.id,
        };
        db.About.create(new_about)
        .then( about => {
          console.log('create new about', about);
          res.json(user);
        })

      })
    }
  })

};

exports.signin = (req, res, next) => {
  const user = req.user;
  console.log('auth_sequelize signin', user);

  const email = user.email;

  // create jsonwebtoken
  const token = jwt.sign({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    _id: user.id,
  }, process.env.JWT_KEY);

  // set session
  req.session.user = user;

  res.send({
    token,
    email,
    firstname: user.firstname,
    lastname: user.lastname,
    id: req.user.id,
  });
};

exports.profileAbout = (req, res, next) => {
  
}
