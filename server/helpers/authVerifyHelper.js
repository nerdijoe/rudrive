const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  auth: (req, res, next) => {
    jwt.verify(req.headers.token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded) {
        req.decoded = decoded;
        next();
      } else {
        res.send('Please Sign In.');
      }
    });
  },
};
