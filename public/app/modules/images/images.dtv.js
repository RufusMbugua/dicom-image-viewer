angular.module('retsu.images').directive('dicomImageList',[function() {
    return {
        restrict: 'A',
        controller: 'imagesCtrl',
        //transclude: false,
        link: function (scope, element) {

              scope.DICOM.forEach(function(dicomId){
                listItem= '<li><a href="#" id="'+dicomId+'"> </a></li>';
                element.append(listItem);
                $.loadImage(dicomId);
              });
      }
    }

}]);
