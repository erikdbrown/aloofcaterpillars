var Q = require('q');
var Meal = require('../models/mealModel.js');
var User = require('../models/userModel.js');
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var Hashids = require("hashids");
var hash = new Hashids('hrPenguins');
var counter = 10;


//findone is the actual mongoose method, and it is being called on the Meal model provided as the second arg. 
var findMeal = Q.nbind(Meal.findOne, Meal);
// create meal is a method that uses the create mongoose method to instantiate a new Meal model
var createMeal = Q.nbind(Meal.create, Meal);
//method for showing all Meal instances
var findAllMeals = Q.nbind(Meal.find, Meal);
var readFile = Q.nbind(fs.readFile, fs);

module.exports = {

  allAvailableMeals: function(req, res, next) {

    Meal.find({})
    .populate('_creator', 'displayName')
    .exec(function(err, meals) {
      if (err) { throw 'Err getting meals: ' + err }

      var available = meals.filter(function(meal) {
        return meal.date_available > new Date();
      })
      console.log(available);
      res.status(200).send(available);
    })
  },

  createMeal: function(req, res, next) {
   var form = new multiparty.Form();

   form.on('error', function(err) {
     console.log('Error parsing form: ' + err.stack);
   });

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }

    var uniqPath = hash.encode(counter);
    counter++;
    fs.rename(files.picture[0].path, 'server/images/'+ uniqPath + '.jpg', function (err) {

      User.findOne({ username: req.username })
      .then(function(user) {
        console.log(user);
        createMeal({
          imgUrl: 'server/images/' + uniqPath + '.jpg'
          description: fields.description[0], // req.body.description, //
          title: fields.title[0], // req.body.title, //
          ingredients: fields.ingredients[0], // req.body.ingredients, //
          _creator: user._id,
          date_available: fields.date_available[0], // req.body.date_available, //
          portions: fields.portions[0], // req.body.portions, //
          // tags: fields.tags[0] // req.body.tags //
        })
        .then(function(meal) {
          res.sendStatus(201);
        });
      })
    })
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

    User.findOne({ username: username })
    .then(function(user) {
      console.log(user);
      Meal.findOne({ _id: meal_id })
      .then(function(meal) {
        if (!meal) {
          res.sendStatus(404);
        }
        meal.consumers.push(user._id);
        meal.save();
        User.update(user, { $inc: { foodTokens : -1 } }, function(err) {
          if (err) { throw 'There was an error removing a token after adding a meal:' + err; }
          User.update({ _id: meal._creator }, { $inc: { foodTokens : +1 } }, function(err) {
            if (err) { throw 'There was an error adding a token to the creator after adding a meal:' + err; }
            res.sendStatus(200);
          });
        });
      });
    });
  },

  deleteMealFromUser: function(req, res, next) {
    // removes a meal from the user's list of meals
    var meal_id = req.params.id;
    var username = req.username;

    User.findOne({ username: username })
    .then(function(user) {
      Meal.findOne({
        _id: meal_id,
        consumers: user._id
      })
      .then(function(meal) {
        if (meal) {
          console.log('Meal: ', meal)
          console.log('Consumers Array: ', meal.consumers)
          meal.consumers.pull(user._id);
          meal.save(function() {
            res.sendStatus(200);
          })
        } else {
          res.sendStatus(404);
        }
      })
    })
  }
};