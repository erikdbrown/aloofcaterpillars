angular.module('auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth, Users, $mdDialog) {
  $scope.user = {};
  $scope.userInfo = {}; // signedIn
  $scope.click = false;
  $scope.location = $location;

  //if you're coming from logout, destroy token

  $scope.showError = function (ev){
    // debugger;
    if($scope.error){
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Error:')
        .textContent($scope.error)
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        // .targetEvent(ev)
      );
    }
  }

  $scope.showOptionError = function (){
    var confirm = $mdDialog.confirm()
          .title('Would you like to sign in?')
          .textContent($scope.error)
          .ariaLabel('Lucky day')
          .ok('Sign In')
          .cancel('No, Let me sign up');
    $mdDialog.show(confirm).then(function() {
      $location.path('/signin');
    }, function() {
    });
  }
  $scope.clicked = function() {
    $scope.click = true;
  }

  Auth.isAuth()
    .then(function (resp){
      if(resp){
        Users.getUserInfo().then(function (resp){
          $scope.userInfo = resp;
        })
      }
  })

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (user) {
        if(!user.error){
          $window.localStorage.setItem('com.oneApp', user.token);
          Users.getUserInfo().then(function (resp){
            $scope.userInfo = resp;
          });
          $location.path('/browse');
        }
        else{
          $scope.error = user.error;
          $scope.showOptionError();
        }

      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (user) {
        if(!user.error){
          $window.localStorage.setItem('com.oneApp', user.token)
          Users.getUserInfo().then(function (resp){
            $scope.userInfo = resp;
          });

          $location.path('/browse');
              //TODO: Save this in correct area for html access
        }
        else{
          $scope.error = user.error;
          $scope.showError();
        }
      })
      .catch(function (error) {
        console.error(error);
      });

  }

  $scope.signout = function() {
    $window.localStorage.removeItem('com.oneApp')
    $window.localStorage.removeItem('com.oneAppTokens');
    $window.localStorage.removeItem('com.oneAppRating');
    $window.localStorage.removeItem('com.oneAppName');
    $window.localStorage.removeItem('com.oneAppID');
    $location.path('/signin')
  };

  $scope.deleteAcc = function (password){
    // password should look like {password: "blah"}
    Auth.deleteAcc(password)
    .then(function (error){
      if(!error){
        $scope.signout();
        // SUCCESS
      }
      else {
        $scope.error = error;
        $scope.showError();
      }
    })
  };

  // $scope.isAuth = function (){
  //   Auth.isAuth().then(function (resp){
  //     if(resp){
  //       return true;
  //     }
  //     else{
  //       return false;
  //     }
  //   })
  // }
});
