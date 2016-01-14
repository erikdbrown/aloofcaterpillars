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
      console.log('user is', user)
      console.log('we created a user')
      if (!user) { console.log('Something bad happened.') }
      else {
        res.sendStatus(200);
      }
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
              var token = jwt.encode(user, 'hrPenguins');
              res.json({
                token: token, username: req.body.username
              });
            } else {
              res.sendStatus(401);
            }
          })
      }
    })
  }, 

  newUser: function(req, res, next) {
    //save input username
    var username = req.body.username;
    //save input password
    var password = req.body.password;
    var displayName = req.body.displayName;
    //create a new user with the request username and password
    findUser({username: username})
    .then(function(user) {
      //if user exists...
      if(user) {
        //...throw error as username already stored in db. 
        next(new Error('username already exists!'));
      } else {
        //otherwise create a user with the provided username and password
        createUser({
          username: username,
          password: password,
          displayName: displayName
        })
        .then(function(newUser) {
          res.sendStatus(200);
        })
      }
    })
    .then(function(user) {
      var token = jwt.encode(user, 'hrPenguins');
      res.json({
        token: token, username: req.body.username
      });
      res.redirect('/browse');
    }); 
  },

  getUser: function(req, res, next) {
    // returns a user from the database
  },

  removeUser: function(req, res, next) {
    // removes a user from the database
  },

  checkAuth: function(req, res, next) {
    // checks user against token
  }
};