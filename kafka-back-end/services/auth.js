const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/mongoose_user');
const About = require('../models/mongoose_about');
const Interest = require('../models/mongoose_interest');

module.exports = {
  signIn: (msg, cb) => {
    var res = {};
    console.log("In handle request, msg="+ JSON.stringify(msg));
  
    // if (msg.username == "bhavan@b.com" && msg.password =="a") {
    //   console.log('*** handle_request user and pass correct');
    //   res.code = "200";
    //   res.value = "Success Login";
    // } else {
    //   console.log('*** handle_request failed login');
    //   res.code = "401";
    //   res.value = "Failed Login";
    // }
  
    const username = msg.username;
    const password = msg.password
  
    User.findOne({
      email: username,
    }, (err, user) => {
      console.log('******** user=', user);
      if (err) cb(err);
      if (!user) {
        cb(null, false, { message: 'User does not exist' });
        // cb.json({ message: 'User does not exist'})
      } else {
        if (passwordHash.verify(password, user.password)) {
          console.log('********* user password is verified, user=', user);
          cb(null, user);
        } else {
          cb(null, false, {message: 'Password is not correct !'})
          // cb(null, false);
        }
      }
    });
  },
  signInToken: (msg, cb) => {
    console.log('signInToken msg=', msg);
    const req = msg;

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

    // res.send({
    //   token,
    //   email,
    //   firstname: user.firstname,
    //   lastname: user.lastname,
    //   // mysql_id: user.mysql_id,
    //   // mongo_id: user._id,
    //   _id: user._id,
    // });

    cb(null, {
      token,
      email,
      firstname: user.firstname,
      lastname: user.lastname,
      // mysql_id: user.mysql_id,
      // mongo_id: user._id,
      _id: user._id,
    });
  },
  signUp: (msg, cb) => {
    console.log('signUp msg=', msg);
    const req = msg;
    const data = req.body;
    data.password = passwordHash.generate(req.body.password);
  
    User.findOne({ email: data.email }, (err, user) => {
      if (user) {
        const errorMsg = {
          message: 'Email is already used. Please sign up using different email.',
        };
        // res.json(errorMsg);
        cb(false, errorMsg);
      } else {
        User.create({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
          // mysql_id: 0,
        }, (err2, newUser) => {
          if (err2) cb(false, err2); //res.json(err2);
  
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
              // res.json(newUser);
              cb(false, newUser);
            });
          }); // end of newAbout.save
        });
      } // end of else
    });

  },
};

// function handle_request(msg, cb) {
//   var res = {};
//   console.log("In handle request, msg="+ JSON.stringify(msg));

//   // if (msg.username == "bhavan@b.com" && msg.password =="a") {
//   //   console.log('*** handle_request user and pass correct');
//   //   res.code = "200";
//   //   res.value = "Success Login";
//   // } else {
//   //   console.log('*** handle_request failed login');
//   //   res.code = "401";
//   //   res.value = "Failed Login";
//   // }

//   const username = msg.username;
//   const password = msg.password

//   User.findOne({
//     email: username,
//   }, (err, user) => {
//     if (err) cb(err);
//     if (!user) {
//       cb(null, false, { message: 'User does not exist' });
//       // cb.json({ message: 'User does not exist'})
//     } else {
//       if (passwordHash.verify(password, user.password)) {
//         console.log('********* user password is verified, user=', user);
//         cb(null, user);
//       } else {
//         // cb(null, false, {message: 'Password is not correct !'})
//         cb(null, false);
//       }
//     }
//   });


//   // callback(null, res);
// }

// exports.handle_request = handle_request;
