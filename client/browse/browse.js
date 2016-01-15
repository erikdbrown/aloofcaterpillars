
angular.module('browse',['ngMaterial', 'ngMessages', 'factories', 'ngAnimate', 'fmp-card'])
.controller('browseCtrl',   function($scope, $window, Meals, Users, Auth, $mdDialog) {

  $scope.searchInput = '';

  //Pulls logged in user from localStorage
  $scope.activeUser = $window.localStorage.getItem('com.oneAppUser');

  $scope.search = function (meal) {
    // return angular.lowercase(meal.title).indexOf($scope.searchInput || '') !== -1;

    // enable when server returns meals with this information
    return (
      angular.lowercase(meal.title).indexOf($scope.searchInput || '') !== -1 || 
      angular.lowercase(meal.description).indexOf($scope.searchInput || '') !== -1|| 
      angular.lowercase(meal.tags).indexOf($scope.searchInput || '') !== -1|| 
      angular.lowercase(meal.ingredients).indexOf($scope.searchInput || '') !== -1|| 
      angular.lowercase(meal.creator).indexOf($scope.searchInput || '') !== -1);
  };

  $scope.data;
  $scope.browseMeals = [];

  // disable this when server works
  // $scope.browseMeals = [{
  //   _id: 1,// _id: populated automatically by mongoDB
  //   imgUrl: 'http://placehold.it/325x325', // TODO: store picure URL 
  //   description: 'It\'s... just ice cream. I mean, it\'s pretty good ice cream, but don\'t expect the world',
  //   title: 'A la mode a la mode',
  //   ingredients: 'beef, chicken',
  //   _creator: 'Mark', // TODO: need to pull the _id from Users schema
  //   consumers: ['Jack', 'Marshall'],  // in query, this will be populated
  //   date_available: new Date(), // TODO: check that this is correct
  //   portions: 5,
  //   tags: 'vegan, low-carb', // in query, this will be populated
  //   rating: 4 // need to write a 'query with options' http://mongoosejs.com/docs/populate.html
  // }, {
  //   _id: 2,// _id: populated automatically by mongoDB
  //   imgUrl: 'http://placehold.it/325x325', // TODO: store picure URL 
  //   description: 'You don\'t want to know',
  //   title: 'hot dog',
  //   ingredients: ['beef', 'chicken'],
  //   _creator: 'Jack', // TODO: need to pull the _id from Users schema
  //   consumers: ['Michael'],  // in query, this will be populated
  //   date_available: new Date(), // TODO: check that this is correct
  //   portions: 2,
  //   tags: ['vegan', 'low-carb'], // in query, this will be populated
  //   rating: 5 // need to write a 'query with options' http://mongoosejs.com/docs/populate.html
  // }];
  // enable this when server works
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
      $mdDialog.hide(true)
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
      if (request) {
        $scope.requestMeal(meal);
      }
    });
  };

  $scope.requestMeal = function(meal) {
    meal.hide = true;
    Meals.buyMeal(meal._id)
    .then(function(data) {
      console.log('meal requested')
    });
  };
});
