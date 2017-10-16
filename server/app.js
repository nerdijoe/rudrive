const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');
const cors = require('cors');

const session = require('client-sessions');

const Sequelize = require('sequelize');
const path = require('path');

const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, 'config', 'config.json'))[env];
const pool = {
  max: 5,
  min: 0,
  idle: 10000,
};
const configWithPooling = {
  username: 'root',
  password: 'damnit',
  database: '273_lab1_dropbox',
  host: '127.0.0.1',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};

const sequelize = new Sequelize(config.database, config.username, config.password, config, pool);

sequelize
  .authenticate()
  .then(() => {
    console.log('Sequelize MySQL Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

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


app.use(session({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: process.env.SESSION_SECRET, // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5,
}));

const index = require('./routes/index');
const auth = require('./routes/auth');
const users = require('./routes/users');
const authSequelize = require('./routes/auth_sequelize');
const uploads = require('./routes/uploads');
const files = require('./routes/files');
const folders = require('./routes/folders');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/users', users);
app.use('/authseq', authSequelize);
app.use('/uploads', uploads);
app.use('/files', files);
app.use('/folders', folders);

app.use('./public/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize());

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (username, password, done) => {
  console.log(`passport----> ${username}, ${password}`);
  let db = require('./models');

  db.User.findOne({
    where: {
      email: username
    }
  }).then( user => {
    if(!user) {
      done('User does not exist');
    } else {
      if (passwordHash.verify(password, user.password)) {
        done(null, user);
      } else {
        done ('Email and password do not match');
      }
    }
  }).catch (err => {
    done('Error')
  })

  // User.findOne({ email: username }, (err, user) => {
  //   if (err) { return done(err); }
    
  //   console.log(`here, user=${user}`);

  //   if (!user) {
  //     done('User does not exist');
  //   } else {
  //     if (passwordHash.verify(password, user.password)) {
  //       done(null, user);
  //     } else {
  //       done('Email and password do not match!');
  //     }
  //   }
  // });
}));

// mongoose
// passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (username, password, done) => {
//   console.log(`----> ${username}, ${password}`);
//   let User = require('./models/user');
//   User.findOne({ email: username }, (err, user) => {
//     if (err) { return done(err); }
    
//     console.log(`here, user=${user}`);

//     if (!user) {
//       done('User does not exist');
//     } else {
//       if (passwordHash.verify(password, user.password)) {
//         done(null, user);
//       } else {
//         done('Email and password do not match!');
//       }
//     }
//   });
// }));

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
