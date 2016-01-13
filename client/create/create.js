angular.module('create', [])

.controller('createCtrl', ['$scope', 'Meals', 'Upload', 'Auth', '$base64', '$window', function($scope, Meals, Upload, Auth) {

  //Add meal via POST request from Meals factory
    $scope.addMeal = function(meal) {
     
    var meal = meal;
    console.log(Upload)
    var creator = Auth.currentUser();

    meal.upload = Upload.upload({
      url: '/api/create',
      data: {meal: meal, creator: creator, title: $scope.meal.title, quantity: $scope.meal.quantity},
    });
    meal.upload.then(function (resp) {
      alert('MEAL CREATED')

      });
    }

  //These button functions are activated when the user chooses from dropdown
    $scope.addProtein= function(ingredient, meal) {
      console.log('addProt')
      $scope.data.protein = ingredient.name
    }

     $scope.addRestrict= function(diet, meal) {
      console.log('restrict')
      $scope.data.diet = diet
    }
}])
