var mongoose = require('mongoose');
var Meal =  require('./mealModel.js');
var User =  require('./userModel.js');

var FeedbackSchema = mongoose.Schema({
  // _id: automatically populated by MongoDB
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // TODO: needs to reference the creator's ObjectID
  consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // TODO: needs to reference the eater's ObjectID
  freshness: { type: Number, default: 0 }, // TODO: check in on what things we're rating
  flavor: { type: Number, default: 0 },
  filling: { type: Number, default: 0 },
  meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meals' } // TODO: needs to reference the meal's ObjectID
});

// FeedbackSchema.pre('save', function(next) {

// })

var Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;