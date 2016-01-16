var Q = require('q');
var Meal = require('../models/mealModel.js');
var User = require('../models/userModel.js');
var keys = require('../config/apiKeys.js')
var fs = require('fs');
var path = require('path');
var utils = require('../config/utils.js')
// var s3 = new AWS.S3({ params: { Bucket: 'lunchboxhr', Key: keys.s3Key } });


//findone is the actual mongoose method, and it is being called on the Meal model provided as the second arg. 
var findMeal = Q.nbind(Meal.findOne, Meal);
// create meal is a method that uses the create mongoose method to instantiate a new Meal model
var createMeal = Q.nbind(Meal.create, Meal);
//method for showing all Meal instances
var findAllMeals = Q.nbind(Meal.find, Meal);

module.exports = {

  allAvailableMeals: function(req, res, next) {

    Meal.find({})
    .populate('_creator', 'displayName')
    .exec(function(err, meals) {
      if (err) { throw 'Err getting meals: ' + err }

      var available = meals.filter(function(meal) {
        return meal.date_available > new Date() && meal.portions_left > 0;
      })
      console.log(available);
      res.status(200).send(available);
    })
  },

  createMeal: function(req, res, next) {

    User.findOne({ username: req.username })
    .then(function(user) {
      createMeal({
        imgUrl: req.imgPath,
        description: req.fields.description[0].split(', '),
        title: req.fields.title[0],
        ingredients: req.fields.ingredients[0].split(', '),
        _creator: user._id,
        date_available: req.fields.date_available[0],
        portions: req.fields.portions[0],
        portions_left: req.fields.portions[0],
        tags: req.fields.tags[0] // req.body.tags //
      })
      .then(function(meal) {
        console.log('you\'ve created the meal');
        console.log('The meal: ', meal)
        res.sendStatus(201);
      });
    });
 },

  editMeal: function(req, res, next) {
    var meal_id = req.params.id;
    var updates = req.body;

    Meal.update({
      _id: meal_id
    }, updates, function() {
      res.sendStatus(200);
    });
  },

  deleteMeal: function(req, res, next) {

    var meal_id = req.params.id;
    var username = req.username;

    User.findOne({ username: username })
    .then(function(creator) {
      console.log('This is the creator: ', creator);
      if (!creator) {
        console.log('Couldn\'t find user');
        res.sendStatus(404);
      }
      Meal.findOne({ _id: meal_id, _creator: creator._id })
      .then(function(meal) {
        console.log('This is the meal requested to be deleted: ', meal);
        if (!meal) {
          res.sendStatus(404);
        }
        if (meal.consumers.length === 0) {
          meal.remove();
          res.sendStatus(200);
        } else {
          var howMany = meal.consumers.length;
          User.update({ _id: { $in: meal.consumers } }, { $inc: { foodTokens : + 1 } } , function(err) { // http://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
            if (err) { throw 'There was an error updating tokens of consumers after deleting a meal: ' + err; }
          });
          User.update(creator, { $inc: { foodTokens : -howMany } }, function(err) {
            if (err) { throw 'There was an error updating tokens on the creator after deleting a meal: ' + err; }
            meal.remove();
            res.sendStatus(200);
          });
        }
      });
    });
  },

  userMeals: function(req, res, next) {

    var date = new Date();
    var userMeals = {};

    User.findOne({ username: req.username})
    .then(function(user) {
      console.log(user._id)
      Meal.find({ _creator: user._id })
      .populate('_creator', 'displayName')
      .populate('consumers', 'displayName')
      .exec(function(err, meals) {
        if (err) { throw 'There was an error fetching a user\'s created meals: ' + err; }
        if (meals.length > 0) {
          userMeals.created = {};
          meals.forEach(function(meal) {
            if (meal.date_available > date) {
              userMeals.created.current = userMeals.created.current || []; 
              userMeals.created.current.push(meal);
            } else {
              userMeals.created.past = userMeals.created.past || [];
              userMeals.created.past.push(meal);
            }
          });
        }
      })
      .then(function() {
        Meal.find({ consumers: user._id })
        .populate('_creator', 'displayName')
        .populate('consumers', 'displayName')
        .exec(function(err, meals) {
          if (err) { throw 'There was an error fetching a user\'s eating meals: ' + err; }
          if (meals.length > 0) {
            userMeals.consumed = {};
            meals.forEach(function(meal) {
              if (meal.date_available > date) {
                userMeals.consumed.current = userMeals.consumed.current || []; 
                userMeals.consumed.current.push(meal);
              } else {
                userMeals.consumed.past = userMeals.consumed.past || []; 
                userMeals.consumed.past.push(meal);
              }
            });
          }
          res.status(200).send(userMeals);
        });
      });
    });
  },

  addMealToUser: function(req, res, next) {
    // adds a selected meal the user's list of meals
    var meal_id = req.params.id;
    var username = req.username;

    User.findOneAndUpdate({ username: username }, { $inc: { foodTokens : -1 } }, function(err, consumer) { // decreases the number of foodTokens for the consumer
      if (err) { throw 'There was an error removing a foodToken after a consumer added a meal:' + err; }
      Meal.findOneAndUpdate({ _id: meal_id }, { $inc: { portions_left : -1 }, $push: { consumers: consumer._id } }, function(err, meal) { // locates meal and pushes consumer into consumers array
        if (err) { throw 'There was an error finding this meal when a consumer added it: ' + err; }
        if (!meal) { 
          res.sendStatus(404); 
        }
        User.findOneAndUpdate({ _id: meal._creator }, { $inc: { foodTokens : +1 } }, function(err, creator) { // locates creator and increase foodTokens
          if (err) { throw 'There was an error finding the creator of the meal and increaing foodTokens: ' + err; }
          if (creator._id === consumer._id) {
            res.sendStatus(401);
          }
          res.sendStatus(200)
        });
      });
    });
  },

  deleteMealFromUser: function(req, res, next) {
    // removes a meal from the user's list of meals
    var meal_id = req.params.id;
    var username = req.username;

    User.findOneAndUpdate({ username: username }, { $inc: { foodTokens: 1 } }, function(err, consumer) { // increases the number of foodTokens for the consumer
      if (err) { throw 'There was an err in finding the consumer after deleting their meal: ' + err; }
      if (!consumer) {
        res.sendStatus(404); // user was not found
      }
      Meal.findOneAndUpdate({ _id: meal_id, consumers: consumer._id}, { $inc: { portions_left : 1 }, $pull: { consumers: consumer._id } }, function(err, meal) { // increases the number of portions
        if (err) { throw 'There was an error increasing portions_left after a consumer removed: ' + err; }
        if (!meal) {
          res.sendStatus(401); // user is not a consumer of this meal.
        }
        User.findOneAndUpdate({ _id: meal._creator }, { $inc: { foodTokens: -1 } }, function(err, creator) {
          if (err) { throw 'There was an error decreasing the foodTokens for the creator after a consumer removes: ' + err; }
          res.sendStatus(200);
        });
      });
    });
  }
};