const User = require('../models/mongoose_user');
const About = require('../models/mongoose_about');
const Interest = require('../models/mongoose_interest');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const kafka = require('../routes/kafka/client');
const action = require('../helpers/actionConstants');

require('dotenv').config();
const fs = require('fs');
//mysql
const db = require('../models');

// hybrid: mysql + mongoDB
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

// only using MongoDB
exports.signupMongo = (req, res, next) => {
  const data = req.body;
  data.password = passwordHash.generate(req.body.password);

  User.findOne({ email: data.email }, (err, user) => {
    if (user) {
      const errorMsg = {
        message: 'Email is already used. Please sign up using different email.',
      };
      res.json(errorMsg);
    } else {
      User.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        // mysql_id: 0,
      }, (err2, newUser) => {
        if (err2) res.json(err2);

        const newAbout = About({
          overview: '',
          work_edu: '',
          contact_info: '',
          life_events: '',
          user: newUser._id,
        });

        newAbout.save((err3, about) => {
          const newInterest = Interest({
            music: '',
            shows: '',
            sports: '',
            fav_teams: '',
            user: newUser._id,
          });
          newInterest.save((err4, interest) => {
            res.json(newUser);
          });
        }); // end of newAbout.save
      });
    } // end of else
  });
};

exports.signin = (req, res) => {
  // req.user is passed from passport
  const user = req.user;
  console.log('auth.signin');
  console.log(user);

  const email = user.email;
  const token = jwt.sign({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    // mysql_id: user.mysql_id,
    // mongo_id: user._id,
    _id: user._id,
  }, process.env.JWT_KEY);

  res.send({
    token,
    email,
    firstname: user.firstname,
    lastname: user.lastname,
    // mysql_id: user.mysql_id,
    // mongo_id: user._id,
    _id: user._id,
  });
};


// only using MongoDB
exports.signupMongoKafka = (req, res, next) => {

  kafka.make_request('request_topic', { action: action.USER_SIGN_UP, body: req.body }, (err, results) => {
    console.log('signupMongoKafka');
    console.log('   results=', results);
    if (err) {
      console.log('  ----> signupMongoKafka Error');
      res.json(err);
    } else {
      res.json(results);
    }
  });

  // const data = req.body;
  // data.password = passwordHash.generate(req.body.password);

  // User.findOne({ email: data.email }, (err, user) => {
  //   if (user) {
  //     const errorMsg = {
  //       message: 'Email is already used. Please sign up using different email.',
  //     };
  //     res.json(errorMsg);
  //   } else {
  //     User.create({
  //       firstname: data.firstname,
  //       lastname: data.lastname,
  //       email: data.email,
  //       password: data.password,
  //       // mysql_id: 0,
  //     }, (err2, newUser) => {
  //       if (err2) res.json(err2);

  //       const newAbout = About({
  //         overview: '',
  //         work_edu: '',
  //         contact_info: '',
  //         life_events: '',
  //         user: newUser._id,
  //       });

  //       newAbout.save((err3, about) => {
  //         const newInterest = Interest({
  //           music: '',
  //           shows: '',
  //           sports: '',
  //           fav_teams: '',
  //           user: newUser._id,
  //         });
  //         newInterest.save((err4, interest) => {
  //           res.json(newUser);
  //         });
  //       }); // end of newAbout.save
  //     });
  //   } // end of else
  // });
};
