var mongoose = require('mongoose');

var mealSchema = mongoose.Schema({
  picture: String, // TODO: store picure URL 
  description: String,
  title: String,
  ingredients: Array,
  // _creator: Schema.User.ObjectId,
  consumers: Array,
  status: {type: String, default: 'false'}, // two statuses: 'open' and 'closed'
  date_available: {type: Date, default: Date.now}, // TODO: check that this is correct
  portions: Number,
  tags: Array,
},
{ 
  timestamps: true
});

var Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal; 

