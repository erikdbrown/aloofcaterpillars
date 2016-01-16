angular.module('about', [])

.controller('aboutController', function($scope, $mdDialog) {
  $scope.persons = [{
    name: 'Siobhan O\'Donovan',
    imgUrl: '/images/shiv.jpeg',
    github: 'https://github.com/justshiv',
    role: 'Frontend Engineer and Scrum Master',
    description: 'Bacon ipsum dolor amet pastrami short ribs porchetta, kielbasa meatball picanha pork belly tongue biltong shankle shank prosciutto pig. Leberkas fatback pork loin, picanha jowl salami kielbasa biltong strip steak bresaola. Landjaeger sausage turkey, short loin frankfurter biltong pancetta. Drumstick tri-tip boudin ball tip sirloin sausage. Cow landjaeger leberkas tenderloin turducken jowl. Pancetta pork chop turkey bresaola tongue cow.'
  },
  {
    name: 'Steven Law',
    imgUrl: '/images/steven.png',
    role: 'Frontend Engineer and Product Owner',
    github: 'https://github.com/s-law',
    description: 'Bacon ipsum dolor amet pastrami short ribs porchetta, kielbasa meatball picanha pork belly tongue biltong shankle shank prosciutto pig. Leberkas fatback pork loin, picanha jowl salami kielbasa biltong strip steak bresaola. Landjaeger sausage turkey, short loin frankfurter biltong pancetta. Drumstick tri-tip boudin ball tip sirloin sausage. Cow landjaeger leberkas tenderloin turducken jowl. Pancetta pork chop turkey bresaola tongue cow.'
  },
  {
    name: 'Gisela Kottmeier',
    imgUrl: '/images/gisela.jpg',
    role: 'Frontend Engineer',
    github: 'https://github.com/GiselaKay',
    description: 'Bacon ipsum dolor amet pastrami short ribs porchetta, kielbasa meatball picanha pork belly tongue biltong shankle shank prosciutto pig. Leberkas fatback pork loin, picanha jowl salami kielbasa biltong strip steak bresaola. Landjaeger sausage turkey, short loin frankfurter biltong pancetta. Drumstick tri-tip boudin ball tip sirloin sausage. Cow landjaeger leberkas tenderloin turducken jowl. Pancetta pork chop turkey bresaola tongue cow.'
  },
  {
    name: 'Erik Brown',
    imgUrl: '/images/erik.jpg',
    role: 'Backend Engineer',
    github: 'https://github.com/erikdbrown',
    description: 'Bacon ipsum dolor amet pastrami short ribs porchetta, kielbasa meatball picanha pork belly tongue biltong shankle shank prosciutto pig. Leberkas fatback pork loin, picanha jowl salami kielbasa biltong strip steak bresaola. Landjaeger sausage turkey, short loin frankfurter biltong pancetta. Drumstick tri-tip boudin ball tip sirloin sausage. Cow landjaeger leberkas tenderloin turducken jowl. Pancetta pork chop turkey bresaola tongue cow.'
  }];

   var requestPerson = function(person) {
    person.hide = true;
  };

  var personController = function($scope, $mdDialog, person) {
    $scope.person = person;

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

  $scope.showPerson = function(event, person) {
    $mdDialog.show({
      controller: personController,
      templateUrl: 'about/person.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: {
        person: person
      }
    })
    .then(function(request) {
      if (request) {
        requestPerson(person);
      }
    });
  }
})