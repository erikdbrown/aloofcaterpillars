var fs = require('fs');

module.exports = {
  getImage: function(req, res, next) {
    
    var fileName = req.params.id; // jsfioawe.png
    var options = {
      root: __dirname + './../images/',
      headers: {
        'Content-Type' : 'image/jpeg'
      }
    }
    res.sendFile(fileName, options, function(err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    })
  }
}