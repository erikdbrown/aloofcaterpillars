var mongoose = require('mongoose');
var User =  require('./userModel.js');
var Feedback =  require('./feedbackModel.js');


var MealSchema = mongoose.Schema({
  // _id: populated automatically by mongoDB
  imgUrl: String, // TODO: store picure URL 
  description: String,
  title: String,
  ingredients: String,
  _creator: String,  // { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // TODO: need to pull the _id from Users schema
  consumers: String,  // in query, this will be populated
  date_available: String, // { type: Date, default: Date.now }, // TODO: check that this is correct
  portions: String,
  tags: String, // in query, this will be populated
  // feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: [] }, // in query, this will be populated
  // overall: Number // need to write a 'query with options' http://mongoosejs.com/docs/populate.html
// }
// ,
// { 
  // timestamps: true
});

// MealSchema.pre('save', function(next) {
//   var meal = this;
//   meal.save();

// })

var Meal = mongoose.model('Meals', MealSchema);

module.exports = Meal; 

