angular.module('browse',['ngMaterial', 'ngMessages', 'factories', 'ngAnimate', 'fmp-card'])
  

.controller('browseCtrl', function($scope, $window, $mdDialog, Meals, Auth) {

  $scope.searchInput = '';

  $scope.search = function (meal) {
    return angular.lowercase(meal.title).indexOf($scope.searchInput || '') !== -1;

    // enable when server returns meals with this information
    // return (
    //   angular.lowercase(meal.title).indexOf($scope.searchInput || '') !== -1 || 
    //   angular.lowercase(meal.description).indexOf($scope.searchInput || '') !== -1|| 
    //   angular.lowercase(meal.tags).indexOf($scope.searchInput || '') !== -1|| 
    //   angular.lowercase(meal.ingredients).indexOf($scope.searchInput || '') !== -1|| 
    //   angular.lowercase(meal.creator).indexOf($scope.searchInput || '') !== -1);
  };

  $scope.data;
  $scope.browseMeals = [];

  Meals.getAllMeals().then(function(data){
    $scope.browseMeals = data.data.map(function(datum) {
      if (datum.ingredients.length) {
        datum.ingredients = datum.ingredients.split(', ');
      }
      if (datum.tags.length) {
        datum.tags = datum.tags.split(', ');
      }
      return datum;
    })
    .filter(function(datum) {
      return datum.creator !== Auth.currentUser();
    });
  });

  var mealController = function($scope, $mdDialog, meal) {
    $scope.meal = meal;

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.close = function() {
      $mdDialog.cancel();
    };
    $scope.requestMeal = function(request) {
      $mdDialog.hide(request)
    };
  };

  $scope.showMeal = function(event, meal) {
    $mdDialog.show({
      controller: mealController,
      templateUrl: 'browse/meal.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: {
        meal: meal
      }
    })
    .then(function(request) {

    });
  };
});
