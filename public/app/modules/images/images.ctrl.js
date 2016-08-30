angular.module('retsu.images',['div']).controller('imagesCtrl', ['$scope', 'Requests',
  '$state','$rootScope','rmFilter','errorMessage','rmCornerstone',
  function(scope, Requests, state, rootScope, rmFilter,errorMessage,rmCornerstone) {
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
          series = series.ID;
          scope.DICOM.push({
            'seriesID':series,
            'previewID': preview
          });
        })
      }
    }

    scope.loadStack = function(series){
      scope.instances = [];
      var chosenSeries = rmFilter.where(patient.series_list,{ID:series})
      chosenSeries.forEach(function(series){
        scope.instances = series.Instances;
      })
    }
  }
])
