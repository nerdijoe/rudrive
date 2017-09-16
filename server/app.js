let express = require('express');
let bodyParser = require('body-parser');
let app = express();

require('dotenv').config();

let index = require('./routes/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);

var port = process.env.PORT || '3000';

app.listen(port, function() {
  console.log(`Dropbox server is listening on port ${port}`);
})

module.exports = app;