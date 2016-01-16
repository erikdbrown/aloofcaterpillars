angular.module('dashboard', ['ngMaterial', 'ngMessages'])

.controller('dashController', function($scope, Users, Feedback) {
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
        imgUrl: '/images/defaultMealImage.png', // need address of default image
        title: 'We don\'t know what it is yet!',
        creator: 'a friend',
        date_available: 'Sometime soon, we hope'
      };
    }

    if (meals.created && meals.created.current.length) {
      $scope.nextOffer = meals.created.current[0];
    } else {
      $scope.nextOffer = {
        imgUrl: '/images/defaultMealImage.png', // need address of default image
        title: 'Share a meal with someone',
        date_available: 'Sometime soon, we hope',
        portions: 'Bring lots of'
      };
    }

    if (meals.created && meals.created.past.length) {
      var randIdx = Math.floor(Math.random()*meals.created.past.length);
      $scope.oneFeedback = meals.created.past[randIdx];
      $scope.oneFeedback.overall = Feedback.retrieveFeedBack($scope.oneFeedback._id).overall;
    } else {
      $scope.oneFeedback = {
        imgUrl: '/images/defaultMealImage.png',
        title: '...what you\'ve shared?',
        overall: 'We don\'t know yet, but we think they\'ll love it!'
      };
    }
  });
});
