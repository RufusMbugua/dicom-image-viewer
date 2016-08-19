angular.module("div",[
  'angularAudioRecorder',
  'ui.router'
]
);

angular.module("div").run(function(){

})

angular.module('div')
      .config(['recorderServiceProvider', function(recorderServiceProvider){
        //configure here
      }]);
