const jwt = require('jsonwebtoken');
module.exports.tokenCheck = function (req, res, next) {
  try {
    let token = req.headers['x-api-key']

    if (token) {
      let validToken = jwt.verify(token, 'subha')
      if (validToken) {
        req.validToken1 = validToken;//(key=value)
        next();
      }
      else {
        res.status(401).send({ status: false, message: 'Token not valid!' })//
      }
    }
    else {
      res.status(401).send({ status: false, message: 'Mandatory header is missing!' })//400
    }
  }
  catch (error) {
    res.status(500).send({ message: "Failed", error: error.message });
  }
}


