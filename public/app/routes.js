/**
 * @ngdoc config
 * @name mainRouteConfig
 * @memberof ClientApp
 * @param $stateProvider {service}
 * @param $urlRouterProvider {service}
 */
 angular.module("div").config(function($stateProvider, $urlRouterProvider) {
   $urlRouterProvider.otherwise("/admin/patients/dashboard");
 });
