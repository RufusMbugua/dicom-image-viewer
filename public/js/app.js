var PATH = {
  _modules:'app/modules/',
  _globals:'app/global/'
}

var VIEW ={
  _modules:function(path){
    return PATH._modules+path+'.tpl.html'
  },
  _globals:function(path){
    return PATH._globals+path+'.tpl.html'
  }
}

angular.module("div", [
  'ui.router',
  'restangular',
  'smart-table',
  'textAngular',
  'angularMoment',
  'ui.bootstrap',
  'highcharts-ng',
  'permission',
  'LocalStorageModule',
  'angularValidator',
  'angular-loading-bar',
  'retsu.admin',
  'retsu.users',
  'retsu.patients',
  'retsu.images',
  'angular.filter'
]);


/**
 * @ngdoc run
 * @name Main
 * @requires $http
 * @requires $rootScope
 * @memberof ClientApp
 */
angular.module("div").run(['$http', '$rootScope', '$state','errorMessage','$sce',
function($http,
  rootScope,
  state,
  errorMessage,
  sce) {
  rootScope.date = new Date();
  rootScope.title = 'KE.scrow';
  rootScope.messages = [];
  rootScope.menu = [];
  rootScope.errors = [];
  rootScope.state = state;
  rootScope.errorList ={}
  errorMessage.list(function(data){
    rootScope.errorList = data;
  })

  rootScope.trustAsHtml = function(html){
    return sce.trustAsHtml(html)
  }
}]);

/**
 * @ngdoc directive
 * @name isActiveNav
 * @param $location
 * @memberof ClientApp
 */
angular.module("div").directive('isActiveNav', ['$location', function(
  $location) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.location = $location;
      scope.$watch('location.path()', function(currentPath) {
        if ('#' + currentPath == element[0].hash) {
          element.parent().addClass('active');
        } else {
          element.parent().removeClass('active');
        }
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name isActiveLink
 * @param $location
 * @memberof ClientApp
 */
angular.module("div").directive('isActiveLink', ['$location', function(
  $location) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.location = $location;
      scope.$watch('location.path()', function(currentPath) {
        if ('#' + currentPath == element[0].hash) {
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
}]);

/**
 * @ngdoc config
 * @name mainRouteConfig
 * @memberof ClientApp
 * @param $stateProvider {service}
 * @param $urlRouterProvider {service}
 */
 angular.module("div").config(function($stateProvider, $urlRouterProvider) {
   $urlRouterProvider.otherwise("/admin/dashboard");
 });

angular.module('div').factory('ArrayHelper', function() {

  var ArrayHelper = {};

  ArrayHelper.clean = function clean(data) {
    var defaults = [
      'createdAt', 'updatedAt', 'created_at', 'updated_at'
    ];

    angular.forEach(data, function(value, key) {
      angular.forEach(value, function(v, k) {
        value.prop(k);
      })
    });
    return data;
  }

  return ArrayHelper;
});

angular.module("div").factory('errorInterceptor', ['$q', '$log',
'$rootScope', '$timeout',
'$injector',
function(q, log, rootScope, timeout, injector) {
  rootScope.error = null;
  return {
    // optional method
    'requestError': function(rejection) {
      // do something on error
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    },
    // optional method
    'response': function(response) {
      if (response.data.success) {
        var success = {
          "icon": "ion-check",
          "type": "success",
          "code": response.status,
          "msg": response.statusText,
          "message": response.data.message
        };
        rootScope.success = success;
        rootScope.showSuccess = true;
        timeout(function() {
          rootScope.showSuccess = false;
        }, 2000);
      }
      return response;
    },


    // optional method
    'responseError': function(response) {
      console.log(response);
      if (!response.data.success) {
        var error = {
          "icon": "ion-android-alert",
          "type": "danger",
          "code": response.status,
          "msg": response.statusText,
          "message": response.data.message
        };
        rootScope.error = error;
        rootScope.showError = true;
        timeout(function() {
          rootScope.showError = false;
        }, 3000);

        // do something on error
        var stateService = injector.get('$state');
        if (response.status == 401) {
          timeout(function() {
            stateService.go('login');
          }, 3000)
        }
      }
      return q.reject(response);
    }
  }
}
]);

angular.module('div').factory('errorMessage',['Requests',function(Requests){
  var payload={};
  var list;

  return{
    list: function(callback){
      Requests.get('app/global/info/errors.json',payload,callback);
    }
  }
}]);

angular.module("div").config(['$httpProvider', function(httpProvider) {
  httpProvider.interceptors.push('errorInterceptor');
}]);

angular.module('div').factory('rmFilter', ['$rootScope', '$filter', function(rootScope, filter) {
  var rmFilter = {};
  // Group By Filter
  rmFilter.groupBy = filter('groupBy');
  // Order by Filter
  rmFilter.orderBy = filter('orderBy');
  rmFilter.where = filter('where');

  rmFilter.cleanDates = function cleanDates(data) {
    angular.forEach(data, function(value, key) {
      if (typeof value.created_at !== 'undefined') {
        value.created_at = moment(value.created_at).format(
          'DD-MM-YYYY');
      }
    })
    return data;
  }
  return rmFilter;
}]);

angular.module('div').factory('Requests', ['$http', '$rootScope', function(
  http, rootScope) {
  var Requests = {};
  Requests.data = [];
  Requests.post_data = []
  var base_url = "";
  var url = null;

  /**
   * Post Data
   * @param  {[type]} resource [description]
   * @param  {[type]} object   [description]
   * @return {[type]}          [description]
   */
  Requests.post = function post(resource, object, callBack) {
    var request_url = '';
    if (object.top_level) {
      request_url = resource;
    } else {
      request_url = base_url + resource;
    }
    var req = {
      method: 'POST',
      url: request_url,
      data: object
    };

    /**
     * Check if Post Data exists
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */

    if (object) {
      http(req)
        .success(function(data) {
          //this is the key
          callBack(data);
        })
        .error(function(data, response) {
          console.log(response + " " + data);
        });;
    }
  }

  /**
   * @description Put Data
   * @param resource
   * @param object
   * @param callBack
   */
  Requests.put = function put(resource, object, callBack) {

    var req = {
      method: 'PUT',
      url: base_url + resource,
      data: object
    };

    /**
     * Check if Post Data exists
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    if (object) {
      http(req)
        .success(function(data) {
          //this is the key
          callBack(data);
        })
        .error(function(data, response) {
          console.log(response + " " + data);
        });;
    }
  }

  Requests.destroy = function destroy(resource, object, callBack) {

    var req = {
      method: 'DELETE',
      url: base_url + resource,
      data: object
    };

    /**
     * Check if Post Data exists
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    if (object) {
      http(req)
        .success(function(data) {
          //this is the key
          callBack(data);
        })
        .error(function(data, response) {
          console.log(response + " " + data);
        });;
    }
  }


  /**
   * [get description]
   * @return {[type]} [description]
   */
  Requests.get = function get(resource, object, callBack) {
    var req;
    var request_url = '';
    if (object.top_level) {
      request_url = resource;
      delete(object.top_level);
    } else {
      request_url = base_url + resource;
    }
    req = {
      method: 'GET',
      url: request_url,
      headers: {
        'Content-Type': 'application/json'
      },
      params: object
    };

    http(req)
      .success(function(data) {
        //this is the key
        callBack(data);
      })
      .error(function(data, response) {
        console.log(response + " " + data);
      });;
  }
  return Requests;
}])

angular.module('div').factory('rmCornerstone',[function(element){
  var orthanc_url = 'http://orthanc.rufusmbugua.com/';
  var viewport = null;




  var rmCornerstone =
  {
    /**
    * [function description]
    * @param  {[type]} element [description]
    * @param  {[type]} image   [description]
    * @return {[type]}         [description]
    */
    loadImage : function(element,image){
      cornerstone.enable(element);
      cornerstone.loadImage('wadouri:'+orthanc_url+'/instances/'+image+'/file').then(function(image) {
        cornerstone.displayImage(element, image);
      });
    },
    /**
    * [loadViewPort description]
    * @param  {[type]} element [description]
    * @param  {[type]} image   [description]
    * @return {[type]}         [description]
    */
    loadViewPort : function (element,stackImages){
      viewport = element;
      var imageIds = [];

      stackImages.forEach(function(image){
        imageIds.push('wadouri:'+orthanc_url+'/instances/'+image+'/file')
      });
      var stack = {
        currentImageIdIndex : 0,
        imageIds: imageIds
      };
      cornerstone.enable(viewport);
      cornerstone.loadImage('wadouri:'+orthanc_url+'/instances/'+stackImages[0]+'/file').then(function(image) {
        cornerstone.displayImage(viewport, image);
        // image enable the dicomImage element
        // Enable mouse and touch input
        cornerstoneTools.mouseInput.enable(viewport);
        cornerstoneTools.touchInput.enable(viewport);
        cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
        cornerstoneTools.addToolState(element, 'stack', stack);
        // Enable all tools we want to use with this element
        cornerstoneTools.stackScroll.activate(element, 1);
        cornerstoneTools.stackScrollWheel.activate(element);
        cornerstoneTools.scrollIndicator.enable(element);

      });
      rmCornerstone.magnifyConfig(element);
      rmCornerstone.handleTools(element);
      rmCornerstone.handleStack(element,stack,imageIds)
    },
    /**
    * [function description]
    * @param  {[type]} element [description]
    * @return {[type]}         [description]
    */
    resetViewPort: function(element){
      cornerstone.reset(element)
    },
    /**
    * [function description]
    * @param  {[type]} element [description]
    * @return {[type]}         [description]
    */
    disableViewPort: function(element){
      cornerstone.disable(element)
    },
    /**
    * [function description]
    * @param  {[type]} element [description]
    * @return {[type]}         [description]
    */
    magnifyConfig:function(element){
      var magLevelRange = $("#magLevelRange")
      magLevelRange.on("change", function() {
        var config = cornerstoneTools.magnify.getConfiguration();
        config.magnificationLevel = parseInt(magLevelRange.val(), 10);
      });
      var magSizeRange = $("#magSizeRange")
      magSizeRange.on("change", function() {
        var config = cornerstoneTools.magnify.getConfiguration();
        config.magnifySize = parseInt(magSizeRange.val(), 10)
        var magnify = $(".magnifyTool").get(0);
        magnify.width = config.magnifySize;
        magnify.height = config.magnifySize;
      });
      var mag_config = {
        magnifySize: parseInt(magSizeRange.val(), 10),
        magnificationLevel: parseInt(magLevelRange.val(), 10)
      };
      // cornerstoneTools.arrowAnnotate.setConfiguration(config);
      cornerstoneTools.magnify.setConfiguration(mag_config);
    },
    /**
    * [disableTools description]
    * @param  {[type]} element [description]
    * @return {[type]}         [description]
    */
    disableTools:function disableTools(element){
      cornerstoneTools.zoomTouchDrag.disable(element);
      cornerstoneTools.rotate.disable(element, 1);
      cornerstoneTools.rotateTouchDrag.disable(element);
      cornerstoneTools.zoom.disable(element, 1);
      cornerstoneTools.length.disable(element, 1);
      cornerstoneTools.arrowAnnotate.disable(element, 1);
      cornerstoneTools.highlight.disable(element, 1);
      cornerstoneTools.simpleAngle.disable(element, 1);
      cornerstoneTools.simpleAngleTouch.disable(element);
      cornerstoneTools.dragProbe.disable(element);
      cornerstoneTools.dragProbeTouch.disable(element);
      cornerstoneTools.freehand.disable(element);
      cornerstoneTools.magnify.disable(element, 1);
      cornerstoneTools.magnifyTouchDrag.disable(element);
      // Enable all tools we want to use with this element
      cornerstoneTools.stackScroll.disable(element);
      cornerstoneTools.stackScrollWheel.disable(element);
      cornerstoneTools.scrollIndicator.enable(element);
    },
    /**
    * [function description]
    * @param  {[type]} element [description]
    * @return {[type]}         [description]
    */
  activateTools: function(element){
      rmCornerstone.disableTools(viewport);
      $('.btn').removeClass('active');
      $(element).addClass('active');
      rmCornerstone.resetViewPort(viewport);
    },
    /**
    * [function description]
    * @param  {[type]} element [description]
    * @return {[type]}         [description]
    */
    handleTools: function(element){
      // Zoom
      $('a#zoom').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.zoomTouchDrag.activate(element);
        cornerstoneTools.zoom.activate(element, 1);
        return false;
      });

      $('a#rotate').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        // Enable all tools we want to use with this element
        cornerstoneTools.rotate.activate(element, 1);
        cornerstoneTools.rotateTouchDrag.activate(element);
        return false;
      });


      $('a#length').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.length.activate(element, 1);
        return false;
      });

      $('a#annotate').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.arrowAnnotate.activate(element, 1);
        cornerstoneTools.arrowAnnotateTouch.activate(element);
        return false;
      });

      $('a#highlight').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.highlight.activate(element, 1);
        return false;
      });

      $('a#save').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        var filename = $("#filename").val();
        cornerstoneTools.saveAs(element, filename);
        return false;
      });

      $('a#angle').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.simpleAngle.activate(element, 1);
        cornerstoneTools.simpleAngleTouch.activate(element);
        return false;
      });

      $('a#dragProbe').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.dragProbe.activate(element,1);
        cornerstoneTools.dragProbeTouch.activate(element);
        return false;
      });

      $('a#freehand').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.freehand.activate(element,1);
        return false;
      });

      $('a#magnify').on('click touchstart', function() {
        rmCornerstone.activateTools(this);
        cornerstoneTools.magnify.activate(element, 1);
        cornerstoneTools.magnifyTouchDrag.activate(element);
        return false;
      })
    },
    handleStack : function(element, stack, imageIds){

      function onViewportUpdated(e, data) {
        var viewport = data.viewport;
        $('#mrbottomleft').text("WW/WC: " + Math.round(viewport.voi.windowWidth) + "/" + Math.round(viewport.voi.windowCenter));
        $('#zoomText').text("Zoom: " + viewport.scale.toFixed(2));
      };

      $(element).on("CornerstoneImageRendered", onViewportUpdated);
      function onNewImage(e, data) {
        var newImageIdIndex = stack.currentImageIdIndex;
        // Update the slider value
        var slider = document.getElementById('slice-range');
        slider.value = newImageIdIndex;
        // Populate the current slice span
        var currentValueSpan = document.getElementById("sliceText");
        currentValueSpan.textContent = "Image " + (newImageIdIndex + 1) + "/" + imageIds.length;
        // if we are currently playing a clip then update the FPS
        var playClipToolData = cornerstoneTools.getToolState(element, 'playClip');
        if (playClipToolData !== undefined && !$.isEmptyObject(playClipToolData.data)) {
          $("#frameRate").text("FPS: " + Math.round(data.frameRate));
        } else {
          if ($("#frameRate").text().length > 0) {
            $("#frameRate").text("");
          }
        }
      }
      $(element).on("CornerstoneNewImage", onNewImage);
      var loopCheckbox = $("#loop");
      loopCheckbox.on('change', function() {
        var playClipToolData = cornerstoneTools.getToolState(element, 'playClip');
        playClipToolData.data[0].loop = loopCheckbox.is(":checked");
      })

      // Initialize range input
      var range, max, slice, currentValueSpan;
      range = document.getElementById('slice-range');
      // Set minimum and maximum value
      range.min = 0;
      range.step = 1;
      range.max = stack.imageIds.length - 1;
      // Set current value
      range.value = stack.currentImageIdIndex;
      function selectImage(event){
        var targetElement = document.getElementById("dicomImage");
        // Get the range input value
        var newImageIdIndex = parseInt(event.currentTarget.value, 10);
        // Get the stack data
        var stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
        if (stackToolDataSource === undefined) {
          return;
        }
        var stackData = stackToolDataSource.data[0];
        // Switch images, if necessary
        if(newImageIdIndex !== stackData.currentImageIdIndex && stackData.imageIds[newImageIdIndex] !== undefined) {
          cornerstone.loadAndCacheImage(stackData.imageIds[newImageIdIndex]).then(function(image) {
            var viewport = cornerstone.getViewport(targetElement);
            stackData.currentImageIdIndex = newImageIdIndex;
            cornerstone.displayImage(targetElement, image, viewport);
          });
        }
      }
      // Bind the range slider events
      $("#slice-range").on("input", selectImage);
    },
    playStack : function(element,button){

      rmCornerstone.activateTools(button);
      // Enable all tools we want to use with this element

      cornerstoneTools.playClip(element, 3);
      return false;
    },
    stopStack : function(element, button){
      rmCornerstone.activateTools(button);
      cornerstoneTools.stopClip(element);
      $("#frameRate").text("");
      return false;
    }
  }

  return rmCornerstone;
}]);

angular.module('retsu.admin',[]).controller('adminCtrl', ['$scope', 'Requests',
  '$state',
  function(scope, Requests, state) {
  }
])

angular.module('retsu.admin').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin', {
    url: '/admin',
    views: {
      '': {
        templateUrl: VIEW._modules('admin/admin.main')
      },
      'admin.header@admin':{
        templateUrl: VIEW._modules('admin/admin.header')
      }
    }
  }).
  state('admin.dashboard', {
    url: '/dashboard',
    views: {
      '': {
        controller: 'adminCtrl',
        templateUrl: VIEW._modules('admin/admin.dashboard')
      }
    }
  })
});

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

    scope.play = function play($event){
      var dicomImage = $('#dicomImage');
      rmCornerstone.playStack(dicomImage[0],$event.target)
    }

    scope.stop = function stop($event){
      var dicomImage = $('#dicomImage');
      rmCornerstone.stopStack(dicomImage[0],$event.target)
    }
  }
])

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


angular.module('retsu.images').directive('dicomStack',['rmCornerstone','Requests',function(rmCornerstone,Requests) {
    return {
        controller: 'imagesCtrl',
        restrict:'EA',
        link: function (scope, element,attrs) {
          rmCornerstone.loadViewPort(element[0],scope.instances);
      }
    }

}]);

angular.module('retsu.images').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin.images', {
    url: '/images',
    views: {
      '': {
        controller:'imagesCtrl',
        templateUrl: VIEW._modules('images/images.main')
      },
      'dicomImage@admin.images':{
        templateUrl: VIEW._modules('images/dicom')
      },
      'actionHeader@admin.images':{
        templateUrl: VIEW._modules('images/images.header')
      }
    }
  })
});

angular.module('retsu.patients',[]).controller('patientsCtrl', ['$scope', 'Requests',
  '$state','$rootScope',
  function(scope, Requests, state, rootScope) {
    scope.user = {};

    scope.filterOptions = ['Date', 'Tags'];
    get();
    function get() {
      var payload = {};
      Requests.get('orthanc/patients', payload, function(data) {
        rootScope.patients = data;
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

angular.module('retsu.patients').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('admin.patients', {
    url: '/patients',
    views: {
      '': {
        controller: 'patientsCtrl',
        templateUrl: VIEW._modules('patients/patients.main')
      }
    }
  })
  .state('admin.patients.dashboard', {
    url: '/dashboard',
    views: {
      '': {
        templateUrl: VIEW._modules('patients/patients.dashboard')
      },
      'patients.list@admin.patients.dashboard':{
        templateUrl: VIEW._modules('patients/patients.list')
      }
    }
  })
});

angular.module('retsu.users',[]).controller('usersCtrl', ['$scope', 'Requests',
  '$state',
  function(scope, Requests, state) {
    scope.user = {};

    scope.filterOptions = ['Date', 'Tags'];

    function get() {
      var payload = {};
      Requests.get('questions', payload, function(data) {
        scope.questions = data.success.data;
      });
    }

    scope.add = function add() {
      var payload = scope.question;
      Requests.post('questions', payload, function(data) {
        if(data.success){
          state.go('admin.questions.list')
        }
      });
    }

    scope.login = function login() {
      var payload = scope.user;
      Requests.post('auth', payload, function(data) {
        if(data.success){
          scope.user = data.user;
          state.go('admin.questions.dashboard')
        }

      });
    }

    scope.edit = function edit() {
      var payload = scope.question;
      Requests.put('questions/' + payload.id, payload, function(data) {
        scope.question = data.success.data;
      });
    }

    scope.view = function view(question) {
      scope.currentQuestion = question;
      state.go('questions.view')
    }
  }
])

angular.module('retsu.users').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('login', {
    url: '/login',
    views: {
      '': {
        controller: 'usersCtrl',
        templateUrl: VIEW._modules('users/users.login')
      }
    }
  })
});
