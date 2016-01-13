var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  foodTokens: Number,
  displayName: String
});

var User = mongoose.model('User', userSchema);

module.exports = User; 
