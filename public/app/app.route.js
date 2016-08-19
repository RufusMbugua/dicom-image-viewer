angular.module('div').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/public");
  $stateProvider.state('login', {
      url: '/login',
      views: {
        '': {
          controller: 'usersCtrl',
          templateUrl: 'app/partials/account/login.html'
        },
        'alerts@login': {
          templateUrl: 'app/partials/account/alerts.html'
        },
        'footer@login': {
          templateUrl: 'app/partials/account/footer.html'
        }
      }
    })
  });
