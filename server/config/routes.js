// links to controllers
var userController = require('../users/userController.js');
var mealController = require('../meals/mealController.js');

// Middleware. Add below as needed

module.exports = function(app, express) {
  // Look into having both get and post
  app.get('/api/signin', userController.signin);
  app.post('/api/signin', userController.signin);

  app.post('/api/register', userController.register);

  // this endpoint returns all the meals objects form the db. TODO check with Jonathon to sync endpoint name 
  app.get('/api/browse', mealController.allMeals);

  app.post('/api/create', mealController.create);

  // this endpoint returns all the meal instances.
  app.get('/api/usermeals', checkUser, mealController.allMeals);

  // this endpoint recieves an object containing a user (the prospective consumer) and the meal being requested and updates the status or the meal to pending  
  app.put('/api/makerequest', checkUser, mealController.makeRequest);

  // this endpoint returns all the pending meals from a user 
  app.get('/api/viewpending', mealController.viewPending);


  // this endpoint returns all the consumers of a meal instance
  app.get('/api/viewuser', mealController.viewUsers);

  // this endpoint takes TWO meal instances and updates the status to sold to confirm transaction
  app.put('/api/confirmrequest', mealController.confirmRequest);
}

var checkUser = function (req,res,next) {
  var token = req.headers['x-access-token'];
  if(!token) {
    res.redirect('/signin');
  } else{
    next();
  }
};

// var express = require('express');
// var app = express();
// var partials = require('express-partials');
// var mongoose = require('mongoose');

// var Meal = require('./db/meals/meal');

// var User = require('./db/users/user');
// var UserController = require('./db/users/userController');

// var q = require('q');
// var jwt = require('jwt-simple');

// var db = require('./db/dbconfig');// uncomment when this is ready

// var app = express();