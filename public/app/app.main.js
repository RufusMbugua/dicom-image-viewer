var PATH = {
  _modules:'app/modules/',
  _globals:'app/global/'
}
var DICOM=[];

var VIEW ={
  _modules:function(path){
    return PATH._modules+path+'.tpl.html'
  },
  _globals:function(path){
    return PATH._globals+path+'.tpl.html'
  }
}

angular.module("div", [
  'ui.router',
  'restangular',
  'smart-table',
  'chart.js',
  'textAngular',
  'angularMoment',
  'ui.bootstrap',
  'highcharts-ng',
  'permission',
  'LocalStorageModule',
  'angularValidator',
  'angular-loading-bar',
  'retsu.admin',
  'retsu.users',
  'retsu.patients',
  'retsu.images',
  'angular.filter'
]);


/**
 * @ngdoc run
 * @name Main
 * @requires $http
 * @requires $rootScope
 * @memberof ClientApp
 */
angular.module("div").run(['$http', '$rootScope', '$state','errorMessage','$sce',
function($http,
  rootScope,
  state,
  errorMessage,
  sce) {
  rootScope.date = new Date();
  rootScope.title = 'KE.scrow';
  rootScope.messages = [];
  rootScope.menu = [];
  rootScope.errors = [];
  rootScope.state = state;
  rootScope.errorList ={}
  errorMessage.list(function(data){
    rootScope.errorList = data;
  })

  rootScope.trustAsHtml = function(html){
    return sce.trustAsHtml(html)
  }
}]);
