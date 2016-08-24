angular.module('retsu.patients',[]).controller('patientsCtrl', ['$scope', 'Requests',
  '$state',
  function(scope, Requests, state) {
    scope.user = {};

    scope.filterOptions = ['Date', 'Tags'];
    function get() {
      var payload = {};
      Requests.get('orthanc/patients', payload, function(data) {
        console.log(data)
        scope.patients = data;
      });
    }

    scope.add = function add() {
      var payload = scope.question;
      Requests.post('patients', payload, function(data) {
        if(data.success){
          state.go('admin.patients.list')
        }
      });
    }

    scope.login = function login() {
      var payload = scope.user;
      Requests.post('auth', payload, function(data) {
        if(data.success){
          scope.user = data.user;
          state.go('admin.patients.dashboard')
        }

      });
    }

    scope.edit = function edit() {
      var payload = scope.question;
      Requests.put('patients/' + payload.id, payload, function(data) {
        scope.question = data.success.data;
      });
    }

    scope.view = function view(question) {
      scope.currentQuestion = question;
      state.go('patients.view')
    }
  }
])
