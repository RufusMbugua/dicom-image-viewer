angular.module('div').controller('patientsController',['$http','Requests','$scope',function(http,Requests,scope){
var orthanc = 'http://orthanc.rufusmbugua.com/'
getPatients();

function getPatients(){
  console.log('patients');
  scope.patients=[];
  var payload={};
  Requests.get(orthanc+'patients',payload,function(data){
    angular.forEach(data,function(value,key){
      Requests.get(orthanc+'patients/'+value,payload,function(patient){
        console.log(patient)
        scope.patients.push(patient);
      })
    })

  });
}
}]);
