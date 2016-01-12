angular
  
  //ngMaterial and ngMessages imported for Angular Material Design
  .module('browse',['ngMaterial', 'ngMessages', 'factories', 'ngAnimate', 'fmp-card'])
  

  .controller('browseCtrl',   function($scope, $window, Meals) {

    //Initialized empty string for user input.
    //Note: This might not be necessary if you can already pull the logged in user via localStorage
    $scope.user = {
      input: '',
    };

    
    //Pulls logged in user from localStorage
    $scope.activeUser = $window.localStorage.getItem('com.oneAppUser');

    //Initialize variables
    $scope.data;
    $scope.browseMeals = [];

    
    // This is hard coded because we wanted a filtering mechanism by the "dominant ingredient"
    $scope.proteins = [
      { category: 'meat', name: 'Chicken' },
      { category: 'meat', name: 'Beef' },
      { category: 'meat', name: 'Pork' },
      { category: 'meat', name: 'Bacon' },
      { category: 'veg', name: 'Tofu' },
      { category: 'veg', name: 'Beans' },
      { category: 'veg', name: 'Protein Shake' },
      { category: 'veg', name: 'Grass' }
    ];

    $scope.restrict = [
      'All', 'Vegetarian', 'Gluten-Free', 'Paleo', 'Low-Carb'
    ]

    Meals.getAllMeals().then(function(data){
      console.log('Trying to get all meals')
      $scope.data = data.data      
    })
    .then(function() {
      for (var i = 0; i < $scope.data.length; i++) {
        if ($scope.activeUser !== $scope.data[i].creator) {
          $scope.browseMeals.push($scope.data[i])
        }
      }
    })

    $scope.makeRequest = function(meal) {            
      var req = {
        username: $window.localStorage.getItem('com.oneAppUser'),
        meal: meal.title
      }
      Meals.makeReq(req).then(function(data) {
        alert('Made the request')
      })
    }


  })
  .config(function($mdThemingProvider) {

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
  });