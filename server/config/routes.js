// links to controllers
var userController = require('../controllers/userController.js');
var mealController = require('../controllers/mealController.js');
var feedbackController = require('../controllers/feedbackController.js');
var tagsController = require('../controllers/tagsController.js');
var utils = require('./utils.js')
var helpers = require('./helpers.js');

// Middleware. Add below as needed

module.exports = function(app, express) {
  // retrieving and deleting a specific user
  app.get('/boorish/users/', helpers.decode, userController.getUser); // retrieves a user
  app.post('/boorish/users', userController.create); // creates a new user
  app.delete('/boorish/users/', helpers.decode, userController.removeUser); // TODO: Remove a user and delete their created meals
  app.post('/boorish/users/signin', userController.signin); // sign in a user
  app.get('/boorish/users/signedin', helpers.decode, userController.checkAuth); // TODO: check user authorization

  // creating, retreiving, and removing meals
  app.get('/boorish/meals', helpers.decode, mealController.allAvailableMeals); // get all meals
  app.post('/boorish/meals', helpers.decode, utils.handleForm, mealController.createMeal); // create a new meal
  app.put('/boorish/meals/:id', helpers.decode, mealController.editMeal); // edit a new meal
  app.delete('/boorish/meals/:id', helpers.decode, mealController.deleteMeal); // delete a meal and redistribute tokens

  // adding, retrieving, and deleting a user's meals
  app.get('/boorish/meals/users/', helpers.decode, mealController.userMeals); // retrieves a user's meals (both created and consumed)
  app.post('/boorish/meals/users/:id', helpers.decode, mealController.addMealToUser); // adds a meal to a user's list. distributes tokens
  app.put('/boorish/meals/users/:id', helpers.decode, mealController.deleteMealFromUser); // removes a meal from a user's list. redistributes tokena

  // retrieving and adding feedback on individual meals
  app.get('/boorish/feedback/meals/:id', helpers.decode, feedbackController.retrieveFeedback); // retrievies average feedback on a meal
  app.post('/boorish/feedback/meals/:id', helpers.decode, feedbackController.addFeedback); // adds feedback to a specific meal by a consumer

  // app.get('/boorish/tags', helpers.decode, tagsController.getTags); // TODO: write controller function
  app.get('server/images/:id', helpers.decode, utils.getImage);
};
