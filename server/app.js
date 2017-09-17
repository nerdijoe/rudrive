const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');
const cors = require('cors');

const app = express();

require('dotenv').config();

// mongoose setup ####
const dbConfig = {
  development: 'mongodb://127.0.0.1/273_lab1_dropbox_dev',
  text: 'mongodb://127.0.0.1/273_lab1_dropbox_test'
};

const appEnv = app.settings.env;
mongoose.connect(dbConfig[appEnv], { useMongoClient: true }, (err, res) => {
  console.log(`Connected to DB: ${dbConfig[appEnv]}`);
});
// mongoose setup end ####


const index = require('./routes/index');
const auth = require('./routes/auth');
const users = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', index);
app.use('/auth', auth);
app.use('/users', users);

app.use(passport.initialize());


passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (username, password, done) => {
  console.log(`----> ${username}, ${password}`);
  let User = require('./models/user');
  User.findOne({ email: username }, (err, user) => {
    if (err) { return done(err); }
    
    console.log(`here, user=${user}`);

    if (!user) {
      done('User does not exist');
    } else {
      if (passwordHash.verify(password, user.password)) {
        done(null, user);
      } else {
        done('Email and password do not match!');
      }
    }
  });
}));

// passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function(username, password, cb) {
//   let User = require('./models/user');
//   User.findOne({
//     username
//   }, function(err, user) {
//     if (err) cb(err)
//     if(!user)
//       cb('User does not exist')
//     else {
//       if (passwordHash.verify(password, user.password)) {
//         cb(null, user)
//       } else {
//         cb('Password is not correct !')
//       }
//     }

//   })
// }));

const port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`Dropbox server is listening on port ${port}`);
});

module.exports = app;
