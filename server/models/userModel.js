var mongoose = require('mongoose');
var Feedback =  require('./feedbackModel.js');
var Meal =  require('./mealModel.js');

var UserSchema = mongoose.Schema({
  // _id: automatically populated by MongoDB
  username: String,
  password: String,
  displayName: String,
  foodTokens: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }
  // ratings: {
  //   received: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' } ],
  //   delivered: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' } ] 
  // },
  // meals: {
  //   created: {
  //     current: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals', default: [] } ],
  //     past: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals', default: [] } ]
  //   },
  //   eating: {
  //     current: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals', default: [] } ],
  //     past: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meals', default: [] } ]
  //   }
  // }
});

var User = mongoose.model('Users', UserSchema);

module.exports = User; 
