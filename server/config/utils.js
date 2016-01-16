var fs = require('fs');
var request = require('request');
var multiparty = require('multiparty');
var govKey = require('./apiKeys.js');
var Hashids = require("hashids");
var hash = new Hashids('hrPenguins');
var counter = 10000;

module.exports = {

  handleForm: function(req, res, next) {
    var form = new multiparty.Form();
    var newPath;

    form.on('error', function(err) {
      console.log('Error parsing form: ' + err.stack);
    });

    form.parse(req, function(err, fields, files) {
      if (err) {
        res.writeHead(400, {'content-type': 'text/plain'});
        res.end("invalid request: " + err.message);
        return;
      }

      if (!files.picture) {
        req.newPath = 'http://www.iconsfind.com/wp-content/uploads/2015/04/Food-Dome-icon.png';
        req.fields = fields;
        console.log('There are no pictures!')
        next();
      } else {
        var uniqPath = hash.encode(counter);
        counter++;
        var path = files.picture[0].path.split('.');
        var ext = path[path.length - 1];
        req.newPath = 'server/images/'+ uniqPath + '.' + ext;
        req.fields = fields;
        fs.rename(files.picture[0].path, req.newPath, function (err) {
          if (err) { next(err); }
          next();
        });
      }
    });
  },


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