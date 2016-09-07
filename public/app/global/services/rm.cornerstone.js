angular.module('div').factory('rmCornerstone',[function(element){
  var orthanc_url = 'http://orthanc.rufusmbugua.com/';
  var viewport = null;
  var rmCornerstone =
  {
    /**
    * <author> Rufus Mbugua
    * <email> mbuguarufus@gmail.com
    * [loadImage description]
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

    loadViewPort : function (element,image){
      viewport = element;
      cornerstone.enable(viewport);
      cornerstone.loadImage('wadouri:'+orthanc_url+'/instances/'+image+'/file').then(function(image) {
        cornerstone.displayImage(viewport, image);
        // image enable the dicomImage element
        // Enable mouse and touch input
        cornerstoneTools.mouseInput.enable(viewport);
        cornerstoneTools.touchInput.enable(viewport);

      });
      rmCornerstone.magnifyConfig(element);
      rmCornerstone.handleTools(element);
    },

    resetViewPort: function(element){
      cornerstone.reset(element)
    },

    disableViewPort: function(element){
      cornerstone.disable(element)
    },

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
    },
    activateTools: function(element){
      rmCornerstone.disableTools(viewport);
      $('.btn').removeClass('active');
      $(element).addClass('active');
    },
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
    }
  }
  return rmCornerstone;
}]);
