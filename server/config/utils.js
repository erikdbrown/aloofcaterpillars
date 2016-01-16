var fs = require('fs');
var request = require('request');
var govKey = require('./apiKeys.js');

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
  // getTags: function(req, res, next) {

  //   var options = {
  //     url: 'http://api.nal.usda.gov/ndb/list?format=json&lt=g&sort=n&api_key=' + givKey,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   };

  //   request(options, function (error, response, body) {
  //     if (!error && response.statusCode === 200) {
  //       console.log(body)
  //     } else {
  //       console.log(error);
  //     }
  //   });
  }
// }