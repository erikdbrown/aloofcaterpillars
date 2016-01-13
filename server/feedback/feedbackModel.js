var mongoose = require('mongoose');

var feedbackSchema = mongoose.Schema({
  user_creator: String, // TODO: needs to reference the creator's ObjectID
  user_eater: String, // TODO: needs to reference the eater's ObjectID
  ratingOne: Number, // TODO: check in on what things we're rating
  ratingTwo: Number,
  ratingThree: Number,
  meal: String // TODO: needs to reference the meal's ObjectID
});

var Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;