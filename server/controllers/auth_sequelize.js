const db = require('../models');

exports.signup = (req, res, next) => {
  console.log(req);

  const user = req.body;
  db.User.create(user)
  .then( user => {
    console.log(`created user`, user);
    res.json(user);
  })  
};

