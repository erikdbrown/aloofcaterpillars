var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  foodTokens: { type: Number, default: 0 },
  displayName: String,
  rating: { type: Number, default: 0 },
  ratings: {
    received: Array,
    delivered: Array 
  },
  meals: {
    created: {
      current: Array,
      past: Array
    },
    eating: {
      current: Array,
      past: Array
    }
  }
});

var User = mongoose.model('Users', userSchema);

module.exports = User; 
