const User = require('../models/mongoose_user');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();
const fs = require('fs');
//mysql
const db = require('../models');

exports.signup = (req, res, next) => {
  const data = req.body;
  data.password = passwordHash.generate(req.body.password);

  User.findOne({ email: data.email }, (err, user) => {
    if (user) {
      const errorMsg = {
        message: 'Email is already used. Please sign up using different email.',
      };
      res.json(errorMsg);
    } else {

      // mysql
      db.User.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        // id: newUser._id,
      })
        .then((mysqlUser) => {
          console.log(`created a new user in mysql db`, mysqlUser);
          // res.json(user);

          // create uniq directory
          var dir = `./public/uploads/${mysqlUser.email}`;
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
            user_id: mysqlUser.id,
          };
          db.About.create(new_about)
            .then((about) => {
              console.log('created a new about');

              const new_interest = {
                music: '',
                shows: '',
                sports: '',
                fav_teams: '',
                user_id: mysqlUser.id,
              };
              db.Interest.create(new_interest)
                .then((interest) => {
                  // console.log('create new interest', interest);

                  User.create({
                    firstname: mysqlUser.firstname,
                    lastname: mysqlUser.lastname,
                    email: mysqlUser.email,
                    password: mysqlUser.password,
                    mysql_id: mysqlUser.id,
                  }, (err2, newUser) => {
                    if (err2) {
                      res.json(err2);
                    } else {
                      res.json(newUser);                          
                    }
                  });
            
                });
            });
        });

      // res.json(newUser);

    } // end of else
  });

  // User.create(data, (err, user) => {
  //   if (err) {
  //     res.json(err);
  //   } else {
  //     res.json(user);
  //   }
  // });
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
    mysql_id: req.user.mysql_id,
    _id: req.user._id,
  }, process.env.JWT_KEY);

  res.send({
    token,
    email,
    mysql_id: req.user.mysql_id,
    _id: req.user._id,
  });
};
