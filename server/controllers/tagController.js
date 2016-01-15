// uncomment if you need to set up a model
// var Tag = require('../models/tagModel.js');
var request = require('request');
var apiKey = require('../config/apiKeys.js');

module.exports = {
  
  getTags: function(req, res, next) {

    request('http://api.nal.usda.gov/ndb/list?format=json&lt=f&sort=n&max=1500&api_key=' + apiKey, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(response.body)
      }
    });
  }

};