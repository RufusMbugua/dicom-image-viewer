angular.module('div').controller('patientsController',['$http','Requests','$scope',function(http,Requests,scope){

getPatients();

function getPatients(){
  scope.patients=[];
  var payload={};
  Requests.get('orthanc/patients',payload,function(data){
      scope.patients=data;
  });
}
}]);
