angular.module('retsu.users').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('login', {
    url: '/login',
    views: {
      '': {
        controller: 'usersCtrl',
        templateUrl: VIEW._modules('users/users.login')
      }
    }
  })
});
