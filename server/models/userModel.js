var mongoose = require('mongoose');
var Feedback =  require('./feedbackModel.js');
var Meal =  require('./mealModel.js');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
  // _id: automatically populated by MongoDB
  username: String,
  password: String,
  displayName: String,
  foodTokens: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  salt: String
});

UserSchema.methods.comparePassword = function(enteredPassword) {
  var dbPassword = this.password;
  return Q.Promise(function(resolve, reject) {
    bcrypt.compare(enteredPassword, dbPassword, function(err, isMatch) {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    console.log('Not modified');
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, null, null, function(err, hash) {
      if (err) { return next(err); }

      user.password = hash;
      user.salt = salt;
      next();

    });
  });
});

var User = mongoose.model('Users', UserSchema);

module.exports = User; 
