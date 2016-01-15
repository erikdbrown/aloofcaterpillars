var Q = require('q');
var Feedback = require('../models/feedbackModel');
var User = require('../models/userModel.js');
var Meal = require('../models/mealModel.js');

var createFeedback = Q.nbind(Feedback.create, Feedback);
var findFeedback = Q.nbind(Feedback.findOne, Feedback);
var findUser = Q.nbind(User.findOne, User);
var findMeal = Q.nbind(Meal.findOne, Meal);

module.exports = {

  retrieveFeedback: function(req, res, next) {
    // returns the ratings for the meals from a specific user
  },

  addFeedback: function(req, res, next) {
    // adds feedback about a specific meal from one user
    var meal_id = req.params.id;
    console.log('you\'re here')

    findUser({ username: req.username })
    .then(function(consumer) {
      findMeal({ _id: meal_id, consumers: consumer._id})
      .then(function(meal) {
        if (!meal) { res.sendStatus(401); }
        findFeedback({ meal: meal_id, consumer: consumer._id })
        .then(function(feedback) {
          if (feedback) { res.sendStatus(401); }
          createFeedback({
            creator: req.body.user_eater,
            consumer: consumer._id,
            freshness: req.body.freshness,
            flavor: req.body.flavor,
            filling: req.body.filling,
            meal: meal._id
          })
          .then(function(feedback) {
            res.sendStatus(201);
          })
        });
      });
    });
  },

  editFeedback: function(req, res, next) {
    // edits feedback 
  }

};