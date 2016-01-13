// links to controllers
var userController = require('../users/userController.js');
var mealController = require('../meals/mealController.js');
var feedbackController = require('../feedback/feedbackController.js');

// Middleware. Add below as needed

module.exports = function(app, express) {
  // retrieving and deleting a specific user
  app.get('/boorish/users/:id', userController.getUser); // retrieve a user
  app.post('/boorish/users', userController.create); // create a new user
  app.delete('/boorish/users/:id', userController.removeUser); // remove a user

  // Authentication and regirstration
  app.post('/boorish/signin', userController.signin); // sign in a user
  app.get('/api/users/signedin', userController.checkAuth); // check user authorization

  // creating, retreiving, and removing meals
  app.get('/boorish/meals', mealController.allMeals); // get all meals
  app.post('/boorish/meals', mealController.createMeal); // create a new meal
  app.put('/boorish/meals', mealController.editMeal); // edit a new meal
  app.delete('/boorish/meals/:id', mealController.deleteMeal) // TODO: write controller to delete meal

  // adding, retrieving, and deleting a user's meals
  app.get('/boorish/meals/user/:id', checkUser, mealController.userMeals) // TODO: write a controller to GET all of a user's meals
  app.post('/boorish/meals/user/:id', checkUser, mealController.addMealToUser) // TODO: write a controller to add a meal to a user's list
  app.put('/boorish/meals/:id/user/:id', mealController.deleteMealFromUser) // TODO: write controller to remove a meal from user's list

  // retrieving and adding feedback on individual meals
  app.get('/boorish/feedback/meals/:id', feedbackController.retrieveFeedback) // TODO: write controller to retrievie feedback on a meal
  app.post('/boorish/feedback/meals/:id', feedbackController.addFeedback) // TODO: write controller to add feedback to a meal
  app.put('/boorish/feedback/meals/:id', feedbackController.editFeedback) // TODO: write controller to retrievie feedback on a meal

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