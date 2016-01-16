var Q = require('q');
var User = require('../models/userModel.js');
var session = require('express-session');
var jwt = require('jwt-simple');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  
  create: function(req, res, next) {
    console.log(req.body);

    findUser({ username: req.body.username })
    .then(function(user) {
      if (user) {
        res.sendStatus(403); // sends a 403 error if user already exists
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
                token: token
              });
            } else {
              res.sendStatus(401);
            }
          })
      }
    })
  },

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
          id: user._id,
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
    res.sendStatus(200);
  }
};