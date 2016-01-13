var Q = require('q');
var Meal = require('./mealModel.js');
var fs = require('fs')
var path = require('path')
var multiparty = require('multiparty')

//findone is the actual mongoose method, and it is being called on the Meal model provided as the second arg. 
var findMeal = Q.nbind(Meal.findOne, Meal);
// create meal is a method that uses the create mongoose method to instantiate a new Meal model
var createMeal = Q.nbind(Meal.create, Meal);
//method for showing all Meal instances
var findAllMeals = Q.nbind(Meal.find, Meal);
var readFile = Q.nbind(fs.readFile, fs);

module.exports = {
  allMeals: function(req, res, next) {
    // returns all meals currently open in the database
  },

  createMeal: function(req, res, next) {
    // creates a new meal in the database
  },

  editMeal: function(req, res, next) {

  },

  deleteMeal: function(req, res, next) {

  },

  userMeals: function(req, res, next) {
    // retrieves a list of meals that are owned or subscribed by the user
  },

  addMealToUser: function(req, res, next) {
    // adds a selected meal the user's list of meals
  },

  deleteMealFromUser: function(req, res, next) {
    // removes a meal from the user's list of meals
  }
};