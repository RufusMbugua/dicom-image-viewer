angular.module("div").factory('errorInterceptor', ['$q', '$log',
'$rootScope', '$timeout',
'$injector',
function(q, log, rootScope, timeout, injector) {
  rootScope.error = null;
  return {
    // optional method
    'requestError': function(rejection) {
      // do something on error
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    },
    // optional method
    'response': function(response) {
      if (response.data.success) {
        var success = {
          "icon": "ion-check",
          "type": "success",
          "code": response.status,
          "msg": response.statusText,
          "message": response.data.message
        };
        rootScope.success = success;
        rootScope.showSuccess = true;
        timeout(function() {
          rootScope.showSuccess = false;
        }, 2000);
      }
      return response;
    },


    // optional method
    'responseError': function(response) {
      console.log(response);
      if (!response.data.success) {
        var error = {
          "icon": "ion-android-alert",
          "type": "danger",
          "code": response.status,
          "msg": response.statusText,
          "message": response.data.message
        };
        rootScope.error = error;
        rootScope.showError = true;
        timeout(function() {
          rootScope.showError = false;
        }, 3000);

        // do something on error
        var stateService = injector.get('$state');
        if (response.status == 401) {
          timeout(function() {
            stateService.go('login');
          }, 3000)
        }
      }
      return q.reject(response);
    }
  }
}
]);

angular.module('div').factory('errorMessage',['Requests',function(Requests){
  var payload={};
  var list;

  return{
    list: function(callback){
      Requests.get('app/global/info/errors.json',payload,callback);
    }
  }
}]);

angular.module("div").config(['$httpProvider', function(httpProvider) {
  httpProvider.interceptors.push('errorInterceptor');
}]);
