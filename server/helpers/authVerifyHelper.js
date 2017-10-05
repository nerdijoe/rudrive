const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  auth: (req, res, next) => {
    // console.log('helper auth req.headers.token=', req.headers.token);
    jwt.verify(req.headers.token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded) {
        req.decoded = decoded;
        console.log('helper auth decode=', decoded);
        next();
      } else {
        res.send('Please Sign In.');
      }
    });
  },
};
