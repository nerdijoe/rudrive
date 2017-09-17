const express = require('express');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();

// mongoose setup ####
var mongoose = require('mongoose');
var db_config = {
  development: 'mongodb://127.0.0.1/273_lab1_dropbox_dev',
  text: 'mongodb://127.0.0.1/273_lab1_dropbox_test'
};

const app_env = app.settings.env;
mongoose.connect(db_config[app_env], { useMongoClient: true }, (err, res) => {
  console.log(`Connected to DB: ${db_config[app_env]}`);
});
// mongoose setup end ####


const index = require('./routes/index');
const auth = require('./routes/auth');
const users = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/auth', auth);
app.use('/users', users);

const port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`Dropbox server is listening on port ${port}`);
});

module.exports = app;
