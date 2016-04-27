var jwt = require('jwt-simple');

module.exports = {

  decode: function (req, res, next) {
    console.log('You\'re in the decoder.')
    var token = req.headers['x-access-token'];
    var username;
    console.log("Token: ", token)

    if (!token) {
      res.send(null); 
    } else {
      // decode token and attach user to the request
      // for use inside our controllers
      username = jwt.decode(token, 'hrPenguins');
      req.username = username;
      next();
    } 
  }
}