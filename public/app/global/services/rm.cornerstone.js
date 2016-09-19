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
