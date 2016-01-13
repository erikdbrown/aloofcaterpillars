var mongoose = require('mongoose');
var User =  require('./userModel.js');
var Feedback =  require('./feedbackModel.js');


var MealSchema = mongoose.Schema({
  // _id: populated automatically
  imgUrl: String, // TODO: store picure URL 
  description: String,
  title: String,
  ingredients: Array,
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // TODO: need to pull the _id from Users schema
  consumers: Array,  // in query, this will be populated
  date_available: {type: Date, default: Date.now}, // TODO: check that this is correct
  portions: Number,
  tags: Array, // in query, this will be populated
  feedback: Array, // in query, this will be populated
  overall: Number // need to write a 'query with options' http://mongoosejs.com/docs/populate.html
},
{ 
  timestamps: true
});

MealSchema.pre('save', function(next) {

})

var Meal = mongoose.model('Meals', MealSchema);

module.exports = Meal; 

