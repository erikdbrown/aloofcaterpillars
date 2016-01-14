var Q = require('q');
var User = require('../models/userModel.js');
var session = require('express-session');
var jwt = require('jwt-simple');

//findone is the actual mongoose method, and it is being called on the User model provided as the second arg. 
var findUser = Q.nbind(User.findOne, User);
// create user is a method that uses the create mongoose method to instantiate a new User model
var createUser = Q.nbind(User.create, User);

//export methods that utilize the Q methods above. 
module.exports = {
  
  create: function(req, res, next) {
    console.log(req.body);

    findUser({ username: req.body.username })
    .then(function (user) {
      if (user) {
        //should refactor this later not to return an error but to check the session. 
        next(new Error('User already in the database'));
      } else {
        return createUser({
          username: req.body.username,
          password: req.body.password,
          displayName: req.body.displayName
        });
      }
    })
    .then(function(user) {
      var token = jwt.encode(user.username, 'hrPenguins');
      res.json({
        token: token, username: user.username
      });
    })
    .fail(function (error) {
      next(error);
    });
  }, 

  signin: function(req, res, next) {
    var password = req.body.password;
    //call findUser, which is the mongoose method findone, which will query for the user from post req
    findUser({
      username: req.body.username
    })
    //when done, if found...
    .then(function(user) {
      if (!user) {
        res.sendStatus(401);
      } else {
        return user.comparePassword(password)
          .then(function(found) {
            if (found) {
              var token = jwt.encode(user.username, 'hrPenguins');
              res.json({
                token: token, username: user.username
              });
            } else {
              res.sendStatus(401);
            }
          })
      }
    })
  },

  // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInNhbHQiOiIkMmEkMTAkcnNyN0xiaE55MHZlVWovWEM1NC5wZSIsInBhc3N3b3JkIjoiJDJhJDEwJGVibzZ0NTJnOGd3aW5CeVBwYmVoMC5GSlFTejcxa2ovZC9ZYlFhNGRBQmZMM3E2QVVUVC5xIiwiX2lkIjoiNTY5NzQ2ZjZmMzQ4OGI3ZTgwY2ExMTY4IiwicmF0aW5nIjowLCJmb29kVG9rZW5zIjowfQ.kYjdLwVM9zs7kvlm8b3QyPgPBmOPBNxcfPlIzjMsk0c

  getUser: function(req, res, next) {
    // returns a user from the database
    var username = req.username;
    console.log(username);
    findUser({ username: username })
    .then(function(user) {
      if (!user) {
        res.sendStatus(404);
      } else {
        res.json({
          username: user.username,
          foodTokens: user.foodTokens,
          displayName: user.displayName,
          rating: user.rating
        })
      }
    })
  },

  removeUser: function(req, res, next) {
    // removes a user from the database
  },

  checkAuth: function(req, res, next) {
    // checks user against token
  }
};