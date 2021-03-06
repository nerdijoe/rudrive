const db = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

exports.signup = (req, res, next) => {
  // console.log(req);

  db.User.findOne({
    where: {
      email: req.body.email,
    }
  }).then((user) => {
    if (user) {
      res.json({message: 'Email is already taken.'});
    }
    else {
      const new_user = req.body;
      new_user.password = passwordHash.generate(new_user.password);
      
      db.User.create(new_user)
        .then((user) => {
          console.log(`created a new user`);
          // res.json(user);

          // create uniq directory
          var dir = `./public/uploads/${user.email}`;
          // create dir if it doesn't exist
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
        
          // need to create a new entry in the about and interest tables
          const new_about = {
            overview: '',
            work_edu: '',
            contact_info: '',
            life_events: '',
            user_id: user.id,
          };
          db.About.create(new_about)
            .then((about) => {
              console.log('created a new about');

              const new_interest = {
                music: '',
                shows: '',
                sports: '',
                fav_teams: '',
                user_id: user.id,
              };
              db.Interest.create(new_interest)
                .then((interest) => {
                  // console.log('create new interest', interest);
                  res.json(user);
                });
            });

      })
    } // eof else
  })

};

exports.signin = (req, res, next) => {
  const user = req.user;
  // console.log('auth_sequelize signin', user);

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

