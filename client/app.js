angular.module('oneApp', [
  'auth',
  'browse',
  'create',
  'dashboard',
  'factories',
  'feedback',
  'fmp-card',
  'ngAnimate',
  'ngRoute',
  'ngMaterial',
  'orders',
  'review',
  'viewReq',
  'base64', //Needed for photo upload
  'ngFileUpload', //Needed for photo upload
  'about'
])

.config(function($routeProvider, $httpProvider, $mdThemingProvider) {


   $mdThemingProvider
    .theme('default')
    .primaryPalette('grey', {
      'default': '800',
      'hue-1': '600',
      'hue-2': '400',
      'hue-3': '100'
    })
    .accentPalette('green', {
      'default': '600',
      'hue-1': '400',
      'hue-2': '800',
      'hue-3': '200',
    })
    .warnPalette('red')
    .backgroundPalette('grey', {
      'default': '100',
      'hue-1': '50',
      'hue-2': '200',
      'hue-3': '400'
    })


    $routeProvider
      .when('/', {
        templateUrl: '/browse/browse.html',
        controller: 'browseCtrl',
        authenticate: true
      })
      .when('/home', {
        templateUrl: './browse/browse.html',
        controller: 'AuthController',
        authenticate: true
      })
      .when('/signin', {
        templateUrl: '/auth/signin.html',
        controller: 'AuthController'
      })
      .when('/browse', {
        templateUrl: '/browse/browse.html',
        controller: 'browseCtrl',
        authenticate: true
      })
      .when('/create', {
        templateUrl: '/create/create.html',
        controller: 'createCtrl',
        authenticate: true
      })
      .when('/register', {
        templateUrl: '/auth/register.html',
        controller: 'AuthController'
      })
      .when('/confirmreq', {
        templateUrl: '/browse/viewReq.html',
        controller: 'viewCtrl',
        authenticate: true
      })
      .when('/view', {
        templateUrl: '/browse/viewReq.html',
        controller: 'viewCtrl',
        authenticate: true
      })
      .when('/logout', {
        templateUrl: '/auth/signin.html',
        controller: 'AuthController'
      })
      .when('/dashboard', {
        templateUrl: '/dashboard/dashboard.html',
        controller: 'dashController',
        authenticate: true
      })
      .when('/feedback', {
        templateUrl: '/feedback/feedback.html',
        controller: 'feedbackController',
        authenticate: true
      })
      .when('/orders', {
        templateUrl: '/orders/orders.html',
        controller: 'ordersController',
        authenticate: true
      })
      .when('/review', {
        templateUrl: '/review/review.html',
        controller: 'reviewController',
        authenticate: true
      })
      .when('/about', {
        templateUrl: '/about/about.html',
        controller: 'aboutController'
      })
      .otherwise({
        redirectTo: '/dashboard'
      })

    //Standard Auth from Angular Shortly
    $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function($window) {
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.oneApp');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(evt, next, current) {
      Auth.isAuth().then(function(authorized) {
        if (next.$$route && next.$$route.authenticate && !authorized) {
          $location.path('/signin');
        }
      });

    });
  });
