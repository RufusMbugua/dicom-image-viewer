var PATH = {
  _modules:'app/modules/',
  _globals:'app/global/'
}

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
  'retsu.patients'
]);


/**
 * @ngdoc run
 * @name Main
 * @requires $http
 * @requires $rootScope
 * @memberof ClientApp
 */
angular.module("div").run(['$http', '$rootScope', '$state', function($http,
  rootScope,
  state) {
  rootScope.date = new Date();
  rootScope.title = 'KE.scrow';
  rootScope.messages = [];
  rootScope.menu = [];
  rootScope.errors = [];
  rootScope.state = state;
}]);

angular.module("div").controller('appCtrl', ['$location', function(
  $location) {
    console.log('Hello');
}]);
