var mongoose = require('mongoose');
var Meal =  require('./mealModel.js');
var User =  require('./userModel.js');

var FeedbackSchema = mongoose.Schema({
  user_creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // TODO: needs to reference the creator's ObjectID
  user_eater: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // TODO: needs to reference the eater's ObjectID
  ratingOne: { type: Number, default: 0 }, // TODO: check in on what things we're rating
  ratingTwo: { type: Number, default: 0 },
  ratingThree: { type: Number, default: 0 },
  meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meals' } // TODO: needs to reference the meal's ObjectID
});

FeedbackSchema.pre('save', function(next) {

})

var Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;