var Q = require('q');
var User = require('./userModel.js');
var session = require('express-session');
var jwt = require('jwt-simple');

//findone is the actual mongoose method, and it is being called on the User model provided as the second arg. 
var findUser = Q.nbind(User.findOne, User);
// create user is a method that uses the create mongoose method to instantiate a new User model
var createUser = Q.nbind(User.create, User);

//export methods that utilize the Q methods above. 
module.exports = {
  
  create: function(req, res, next) {
    findUser({ username: req.body.username })
	  .then(function (user) {
	    console.log('user is', user)
      if (user) {
	      //should refactor this later not to return an error but to check the session. 
		    next(new Error('User already in the database'));
		  } else {
	      console.log('we created a user')
        return createUser({
		      username: req.body.username,
		      password: req.body.password
		    });
		  }
	  });
  }, 

  signin: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    //call findUser, which is the mongoose method findone, which will query for the user from post req
    console.log(req.body);
    findUser({
      username: username
    })
    //when done, if found...
    .then(function(user) {
      if (user) {
        //...user exists. Check their password.
        //save database password
        var dbPassword = user.get('password');
        //if input password equals db password
        if (dbPassword === password) {
          console.log('Congrats. You got in')
          // create token to send back for auth
          var token = jwt.encode(user, 'secret');
          //the big question here is exactly how to handle a redirect. know that res.redirect and res.json end
          //a response, so redirection may have to be handled on client side. 
          res.json({
            token: token, username: username
          });
        //password does not match
        } else {
          console.log('Less congrats. You are redirected')
          //redirect to login
          res.redirect('/signin'); 
        }
      //user not found
      } else {
        console.log('Bruh. Sign up')
        //redirect to sign up
        res.redirect('/register'); 
      }
    });
  }, 

  register: function(req, res, next) {
    //save input username
    var username = req.body.username;
    //save input password
    var password = req.body.password;
    //create a new user with the request username and password
    findUser({username: username})
    .then(function(user) {
      //if user exists...
      if(user) {
        //...throw error as username already stored in db. 
        next(new Error('username already exists!'));
      } else {
        //otherwise create a user with the provided username and password
        return createUser({
          username: username,
          password: password
        });
      }
    })
    .then(function(user) {
      var token = jwt.encode(user, 'secret');
      //res.redirect('/browse');
      res.json({token: token});
    }); 
  },

  getUser: function(req, res, next) {
    // returns a user from the database
  },

  removeUser: function(req, res, next) {
    // removes a user from the database
  }
};