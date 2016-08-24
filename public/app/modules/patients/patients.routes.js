angular.module('retsu.patients').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin.patients', {
    url: '/patients',
    views: {
      '': {
        controller: 'patientsCtrl',
        templateUrl: VIEW._modules('patients/patients.main')
      }
    }
  })
  .state('admin.patients.dashboard', {
    url: '/dashboard',
    views: {
      '': {
        templateUrl: VIEW._modules('patients/patients.dashboard')
      }
    }
  })
});
