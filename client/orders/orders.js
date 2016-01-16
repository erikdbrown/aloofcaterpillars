angular.module('orders', ['ngMaterial', 'ngMessages'])
.controller('ordersController', function($scope, $mdDialog, Users) {
  Users.getMeals()
  .then(function(meals) {
    console.log(meals.created.current)
    $scope.sharedMeals = meals.created.current.map(function(sharedMeal) {
      var people = sharedMeal.consumers.map(function(consumer) {
        return consumer.displayName;
      })
      .join(', ');

      return {
        _id: sharedMeal._id,
        imgUrl: sharedMeal.imgUrl,
        title: sharedMeal.title,
        date_available: sharedMeal.date_available,
        num_portions: sharedMeal.consumers.length,
        requesters: people
      };
    });

    $scope.nextMeals = meals.eating.current.map(function(nextMeal) {
      return {
        _id: nextMeal._id,
        imgUrl: nextMeal.imgUrl,
        title: nextMeal.title,
        creator: nextMeal._creator.displayName,
        date_available: nextMeal.date_available
      };
    });
  });

  $scope.confirmCancelPromise = function(event, meal) {
    var confirm = $mdDialog.confirm()
      .title('Are you sure you no longer want to share this meal?')
      .textContent('Everyone who\'d like to enjoy this meal will be disappointed.')
      .targetEvent(event)
      .ok('Yes, I\'m sure')
      .cancel('No, I\'ve changed my mind');
    $mdDialog.show(confirm).then(function() {
      Users.cancelMeal(meal._id);
      meal.date_available = 'CANCELLED';
    });
  };

  $scope.confirmCancelRequest = function(event, meal) {
    var confirm = $mdDialog.confirm()
      .title('Are you sure you want to cancel your request?')
      .textContent(meal.creator + ' was looking forward to sharing with you.')
      .targetEvent(event)
      .ok('Yes, I\'m sure')
      .cancel('No, I\'ve changed my mind');
    $mdDialog.show(confirm).then(function() {
      Users.returnMeal(meal._id);
      meal.date_available = 'CANCELLED';
    });
  };

  $scope.isAvailable = function(meal) {
    return meal.date_available !== 'CANCELLED'
  };
});
