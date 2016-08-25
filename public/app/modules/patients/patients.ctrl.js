angular.module('retsu.patients',[]).controller('patientsCtrl', ['$scope', 'Requests',
  '$state','$rootScope',
  function(scope, Requests, state, rootScope) {
    scope.user = {};

    scope.filterOptions = ['Date', 'Tags'];
    get();
    function get() {
      var payload = {};
      Requests.get('orthanc/patients', payload, function(data) {
        scope.patients = data;
      });
    }

    scope.add = function add() {
      var payload = scope.patient;
      Requests.post('patients', payload, function(data) {
        if(data.success){
          state.go('admin.patients.list')
        }
      });
    }

    scope.edit = function edit() {
      var payload = scope.patient;
      Requests.put('patients/' + payload.id, payload, function(data) {
        scope.patient = data.success.data;
      });
    }

    scope.view = function view(patient) {
      rootScope.patient = patient;
      state.go('admin.images')
    }
  }
])
