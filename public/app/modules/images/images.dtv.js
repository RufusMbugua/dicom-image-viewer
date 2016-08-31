angular.module('retsu.images').directive('dicomImage',['rmCornerstone',function(rmCornerstone) {
    return {
        controller: 'imagesCtrl',
        restrict:'EA',
        scope: {
          loadStack:'&'
        },
        link: function (scope, element,attrs) {
          rmCornerstone.loadImage(element[0],attrs.id)
      }
    }

}]);


angular.module('retsu.images').directive('dicomStack',['rmCornerstone',function(rmCornerstone) {
    return {
        controller: 'imagesCtrl',
        restrict:'EA',
        link: function (scope, element,attrs) {
          rmCornerstone.loadViewPort(element[0],scope.instances[0])
      }
    }

}]);
