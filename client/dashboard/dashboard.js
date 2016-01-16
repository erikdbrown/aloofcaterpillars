angular.module('dashboard', ['ngMaterial', 'ngMessages'])

.controller('dashController', function($scope, Users) {
  Users.getUserInfo()
  .then(function(user) {
    $scope.tokenBalance = user.lunchboxes;
  });

  Users.getMeals()
  .then(function(meals) {
    if (meals.eating && meals.eating.current.length) {
      $scope.nextMeal = meals.eating.current[0];
    } else {
      $scope.nextMeal = {
        imgUrl: '', // need address of default image
        title: 'We don\'t know what it is yet!',
        creator: 'a friend',
        date_available: 'Sometime soon, we hope'
      };
    }

    if (meals.created && meals.created.current.length) {
      $scope.nextOffer = meals.created.current[0];
    } else {
      $scope.nextOffer = {
        imgUrl: '', // need address of default image
        title: 'Share a meal with someone',
        date_available: 'Sometime soon, we hope',
        portions: 'Be sure to make lots!'
      };
    }

    if (meals.created && meals.created.past.length) {
      var randIdx = Math.floor(Math.random()*meals.created.past.length);
      $scope.oneFeedback = meals.created.past[randIdx];
    } else {
      $scope.oneFeedback = {
        title: 'Share a meal with someone',
        overall: 'They\'ll love it!'
      };
    }
  });
});
