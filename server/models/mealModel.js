var mongoose = require('mongoose');

var MealSchema = mongoose.Schema({
  imgUrl: String, // TODO: store picure URL 
  description: String,
  title: String,
  ingredients: Array,
  _creator: String, // TODO: need to pull this from Users schema
  consumers: Array,
  date_available: {type: Date, default: Date.now}, // TODO: check that this is correct
  portions: Number,
  tags: Array,
  feedback: Array,
  overall: Number
},
{ 
  timestamps: true
});

var Meal = mongoose.model('Meals', MealSchema);

module.exports = Meal; 

