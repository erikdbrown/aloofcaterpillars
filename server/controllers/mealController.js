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
          creator: fields.creator[0],
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

  editMeal: function(req, res, next) { // TODO: Use update and update
    if (!req.userId) {
      res.sendStatus(401);
    } else {
      var mealID = req.params.mid
    }
  },

  deleteMeal: function(req, res, next) {

    var meal_id = req.params.mid;
    var user_id = req.userId;
    Meal.find({ _id: ObjectId(meal_id)})
    .then(function(err, meal) {
      if (err) { throw 'There was an error retrieving your deletion request'; }
      if (meal.creator !== user_id) {
        res.sendStatus(401).('You are not authorized to delete this meal.')
      } else {
        if (meal.consumers.length === 0) {
          meal.remove()
        } else {
          User.find(meal.consumers, function(err, users) { // TODO: can you pass in an array of objects in to .find?
            if (err) { throw 'There was an error retreiving users that were consumers of the deleted meal: ' + err ; }
            users.forEach(function(user) {
              User.update(user, { $inc: { foodTokens : +1 } }, function(err) {
                if (err) { throw 'There was an error updating tokens after deleting a meal: ' + err }
              })
            })
            meal.remove();
          })
        }
      }
    })

  },

  userMeals: function(req, res, next) {
    var date = new Date();
    var userMeals = {
      created: {
        current: [],
        past: []
      },
      eating: {
        current: [],
        past: []
      }
    };

    Meal.find({ creator: ObjectID(_id) })
    .then(function(meals) {
      meals.forEach(function(meal) {
        if (meal.date_available > date) {
          userMeals.created.current.push(meal);
        } else {
          userMeals.created.past.push(meal);
        }
      });
    })
    .then(function() {
      Meal.find({ consumers: Object(_id) })
      .then(function(meals) {
        meals.forEach(function(meal) {
          if (meal.date_available > date) {
            userMeals.eating.current.push(meal);
          } else {
            userMeals.eating.past.push(meal);
          }
        });
        res.status(200).send(userMeals);
      });
    });

  },

  addMealToUser: function(req, res, next) {
    // adds a selected meal the user's list of meals
    var meal_id = req.params.mid;
    var user_id = req.params.uid;

    Meal.findById(meal_id, function(err, meal) {
      if (err) { throw 'There was an error in adding this meal'; }
      if (meal) {
        meal.consumers.push(user_id);
        post.save(function() {
          res.sendStatus(200);
        })
      } else {
        res.sendStatus(404);
      }
    })

  },

  deleteMealFromUser: function(req, res, next) {
    // removes a meal from the user's list of meals
    var meal_id = req.params.mid;
    var user_id = req.params.uid;

    Meal.find({
      _id: ObjectId(meal_id),
      consumers: ObjectId(user_id)
    })
    .exec(function(err, meal) {
      if (err) { throw 'There was an error when deleting this meal'; }
      if (meal) {
        meal.cosumers.pull(ObjectId(_id));
        post.save(function() {
          res.sendStatus(200);
        })
      } else {
        res.sendStatus(404);
      }
    })

  }
};