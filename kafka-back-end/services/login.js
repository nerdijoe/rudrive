const passwordHash = require('password-hash');

const User = require('../models/mongoose_user');

function handle_request(msg, cb) {
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
    if (err) cb(err);
    if (!user) {
      cb(null, false, { message: 'User does not exist' });
      // cb.json({ message: 'User does not exist'})
    } else {
      if (passwordHash.verify(password, user.password)) {
        console.log('********* user password is verified, user=', user);
        cb(null, user);
      } else {
        // cb(null, false, {message: 'Password is not correct !'})
        cb(null, false);
      }
    }
  });


  // callback(null, res);
}

exports.handle_request = handle_request;
