angular.module('retsu.images',[]).controller('imagesCtrl', ['$scope', 'Requests',
  '$state','$rootScope',
  function(scope, Requests, state, rootScope) {
    var patient = rootScope.patient;
    scope.DICOM=[];

    loadSeries();


    function loadSeries(){
      if(!rootScope.patient){
        console.log('Empty')
      }
      else{
        patient.series_list.forEach(function(series){
          preview = series.Instances[0];
          scope.DICOM.push(preview);
        })
      }
    }
  }
])
