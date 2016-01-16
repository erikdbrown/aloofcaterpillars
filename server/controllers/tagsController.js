// uncomment if you need to set up a model
// var Tag = require('../models/tagModel.js');
var request = require('request');
var keys = require('../config/apiKeys.js');

module.exports = {
  
  getIngredients: function(req, res, next) {

    request('http://api.nal.usda.gov/ndb/list?format=json&lt=f&sort=n&max=1500&lt=g&api_key=' + keys.govKey, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body)
      } else {
        console.log(error);
      }
    });
  }
};