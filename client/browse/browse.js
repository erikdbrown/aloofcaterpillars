
angular.module('browse',['ngMaterial', 'ngMessages', 'factories', 'ngAnimate', 'fmp-card'])


  .controller('browseCtrl',   function($scope, $window, Meals, Users, Auth, $mdDialog) {

  $scope.searchInput = '';

    //Pulls logged in user from localStorage
    $scope.activeUser = $window.localStorage.getItem('com.oneAppUser');

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

    // This is hard coded because we wanted a filtering mechanism by the "dominant ingredient"
    // $scope.proteins = [
    //   { category: 'meat', name: 'Chicken' },
    //   { category: 'meat', name: 'Beef' },
    //   { category: 'meat', name: 'Pork' },
    //   { category: 'meat', name: 'Bacon' },
    //   { category: 'veg', name: 'Tofu' },
    //   { category: 'veg', name: 'Beans' },
    //   { category: 'veg', name: 'Protein Shake' },
    //   { category: 'veg', name: 'Grass' }
    // ];
    //
    // $scope.restrict = [
    //   'All', 'Vegetarian', 'Gluten-Free', 'Paleo', 'Low-Carb'
    // ]
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
    $scope.makeRequest = function(meal_id) {
      // var req = {
      //   username: $window.localStorage.getItem('com.oneAppUser'),
      //   meal: meal.title
      // }
      Users.buyMeal(meal_id).then(function(data) {
        alert('Made the request')
      })
    }

    $scope.editMeal = function (meal_id, changes) {
      Users.editMeal(meal_id).then(function (data){
        alert('Made the request')
      })
    }

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
  };
});
