angular.module('feedback', ['ngMaterial', 'ngMessages'])

.controller('feedbackController', function($scope, Users, Feedback) {
  Users.getMeals()
  .then(function(meals) {
    var pastMeals;

    if (meals.created && meals.created.past) {
      pastMeals = meals.created.past;
    }

    if (pastMeals.length) {
      $scope.pastMeals = pastMeals.map(function(pastMeal) {
        return {
          imgUrl: pastMeal.imgUrl,
          meal_id: pastMeal.meal_id,
          title: pastMeal.title,
          date_available: pastMeal.date_available,
          ratings: Feedback.retrieveFeedBack(pastMeal.meal_id)
        };
      });
    } else {
      $scope.pastMeals = [];
    }
  });
});
