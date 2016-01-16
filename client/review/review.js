angular.module('review', ['ngMaterial', 'ngMessages'])

.controller('reviewController', function($scope, $window, Auth, Users, Feedback) {
  Users.getMeals()
  .then(function(meals) {
    var needFeedback = [];
    var reviewerID = $window.localStorage.getItem('com.oneAppID');
    if (meals.eating.past.length) {
      Feedback.retrieveAllFeedback()
      .then(function(meals) {
        meals = meals.map(function(meal) {
          meal.rating = {
            One: 3,
            Two: 3, 
            Three: 3
          };
          meal.show = true;
          return meal;
        });
        $scope.needFeedback = meals;
      });
    } else {
      $scope.needFeedback = [];
    }
  });

  $scope.submitFeedback = function(meal) {
    console.log(meal);
    var feedback = {
      freshness: meal.rating.One,
      flavor: meal.rating.Two,
      filling: meal.rating.Three
    };
    
    Feedback.submitFeedback(meal._id, feedback);
    meal.show = false;
  };

});
