angular.module('retsu.images').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin.images', {
    url: '/images',
    views: {
      '': {
        controller:'imagesCtrl',
        templateUrl: VIEW._modules('images/images.main')
      },
      'dicomImage@admin.images':{
        templateUrl: VIEW._modules('images/dicom')
      },
      'actionHeader@admin.images':{
        templateUrl: VIEW._modules('images/images.header')
      }
    }
  })
});
