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


angular.module('retsu.images').directive('dicomStack',[function() {
    return {
        controller: 'imagesCtrl',
        restrict:'EA',
        link: function (scope, element,attrs) {
          if(scope.instances.length>0){
            index = 0;
            setInterval(function(){
              if(index<scope.instances.length){
              $.loadViewPort(element[0],scope.instances[index])
              index++;
            }
          },1000);

          }

      }
    }

}]);
