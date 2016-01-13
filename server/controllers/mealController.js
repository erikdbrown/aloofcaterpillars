var Q = require('q');
var Meal = require('../models/mealModel.js');
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

  allAvailableMeals: function(req, res, next) {
    findAllMeals({})
    .then(function(meals) {
      var available = meals.filter(function(meal) {
        return meal.date_available < new Date();
      })
      res.status(200).send(available);
    })
    .fail(function(error) {
      res.sendStatus(500);
    });
  },

  createMeal: function(req, res, next) {
    var form = new multiparty.Form({
      autoFiles: true,
      uploadDir: '../images/'
    });

    form.on('error', function(err) {
      console.log('Error parsing form: ' + err.stack);
    });

    form.parse(req, function(err, fields, files) {

      Object.keys(fields).forEach(function(name) {
        console.log('Received field named ' + name);
      });

      Object.keys(files).forEach(function(name) {
        console.log('Received file named ' + name);
      });

      form.on('close', function() {
        console.log('Upload completed!');

        createMeal({
          imgUrl: files.path[0],
          description: fields.description[0],
          title: fields.title[0],
          ingredients: fields.ingredients[0],
          creator: '', /////
          date_available: fields.date_available[0],
          portions: fields.portions[0],
          tags: fields.tags[0]
        })
        .then(function() {
          res.sendStatus(201);
        });
      });
    });
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