// links to controllers
var userController = require('../controllers/userController.js');
var mealController = require('../controllers/mealController.js');
var feedbackController = require('../controllers/feedbackController.js');
var tagController = require('../controllers/tagController.js');

// Middleware. Add below as needed

module.exports = function(app, express) {
  // retrieving and deleting a specific user
  app.get('/boorish/users/:id', userController.getUser); // retrieve a user
  app.post('/boorish/users', userController.create); // create a new user
  app.delete('/boorish/users/:id', userController.removeUser); // remove a user
  app.post('/boorish/users/signin', userController.signin); // sign in a user
  app.get('/boorish/users/signedin', userController.checkAuth); // check user authorization

  // creating, retreiving, and removing meals
  app.get('/boorish/meals', mealController.allMeals); // get all meals
  app.post('/boorish/meals', mealController.createMeal); // create a new meal
  app.put('/boorish/meals/:mid', mealController.editMeal); // edit a new meal
  app.delete('/boorish/meals/:mid', mealController.deleteMeal) // TODO: write controller to delete meal

  // adding, retrieving, and deleting a user's meals
  app.get('/boorish/meals/users/:uid', checkUser, mealController.userMeals) // TODO: write a controller to GET all of a user's meals
  app.post('/boorish/meals/:mid/:uid', checkUser, mealController.addMealToUser) // TODO: write a controller to add a meal to a user's list
  app.put('/boorish/meals/:mid/:uid', mealController.deleteMealFromUser) // TODO: write controller to remove a meal from user's list

  // retrieving and adding feedback on individual meals
  app.get('/boorish/feedback/meals/:mid', feedbackController.retrieveFeedback) // TODO: write controller to retrievie feedback on a meal
  app.post('/boorish/feedback/meals/:mid', feedbackController.addFeedback) // TODO: write controller to add feedback to a meal
  app.put('/boorish/feedback/meals/:mid', feedbackController.editFeedback) // TODO: write controller to retrievie feedback on a meal

  app.get('boorish/tags/', tagController.getTags) // TODO: write controller function

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