var mongoose = require('mongoose');
var User =  require('./userModel.js');
var Feedback =  require('./feedbackModel.js');


var MealSchema = mongoose.Schema({
  // _id: populated automatically by mongoDB
  imgUrl: String, // TODO: store picure URL 
  description: String,
  title: String,
  ingredients: [String],
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // TODO: need to pull the _id from Users schema
  consumers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Users' } ],  // in query, this will be populated
  date_available: { type: Date, default: Date.now }, // TODO: check that this is correct
  portions: Number,
  tags: [String], // in query, this will be populated
  rating: { type: Number, default: 0 } // need to write a 'query with options' http://mongoosejs.com/docs/populate.html
},
{ 
  timestamps: true
});

// MealSchema.pre('save', function(next) {
//   var meal = this;
//   meal.save();

// })

var Meal = mongoose.model('Meals', MealSchema);

module.exports = Meal; 

