var mongoose = require('mongoose');
var Feedback =  require('./feedbackModel.js');
var Meal =  require('./mealModel.js');

var UserSchema = mongoose.Schema({
  // _id: automatically populated by MongoDB
  username: String,
  password: String,
  foodTokens: { type: Number, default: 0 },
  displayName: String,
  rating: { type: Number, default: 0 },
  ratings: {
    received: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' } ],
    delivered: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' } ] 
  },
  meals: {
    created: {
      current: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals' } ],
      past: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals' } ]
    },
    eating: {
      current: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals' } ],
      past: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals' } ]
    }
  }
});

var User = mongoose.model('Users', UserSchema);

module.exports = User; 
