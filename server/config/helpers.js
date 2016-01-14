var jwt = require('jwt-simple');

module.exports = {

  decode: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user_id;

    if (!token) {
      return res.send(403); // send forbidden if a token is not provided
    }
    try {
      // decode token and attach user to the request
      // for use inside our controllers
      // userId = jwt.decode(token, 'secret');
      req.userId = token;
      next();
    } catch (error) {
      return next(error);
    }
  }

}