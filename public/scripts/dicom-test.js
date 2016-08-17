$(document).ready(function() {
  var image = 'wadouri:http://rufusmbugua.com:8043/instances/3ab1634c-fc3309d0-3f7add48-08583c7b-24c62bb6';


  var element = document.getElementById('dicomImage')

  var dialog = document.querySelector('dialog');
  dialogPolyfill.registerDialog(dialog);

  // Define a callback to get your text annotation
  // This could be used, e.g. to open a modal
  function getTextCallback(doneChangingTextCallback) {
    var dialog = $('.annotationDialog');
    var getTextInput = dialog.find('.annotationTextInput');
    var confirm = dialog.find('.annotationDialogConfirm');
    dialog.get(0).showModal();
    confirm.off('click');
    confirm.on('click', function() {
      closeHandler();
    });
    dialog.off("keydown");
    dialog.on('keydown', keyPressHandler);
    function keyPressHandler(e) {
      // If Enter is pressed, close the dialog
      if (e.which === 13) {
        closeHandler();
      }
    }
    function closeHandler() {
      dialog.get(0).close();
      doneChangingTextCallback(getTextInput.val());
      // Reset the text value
      getTextInput.val("");
    }
  }
  // Define a callback to edit your text annotation
  // This could be used, e.g. to open a modal
  function changeTextCallback(data, eventData, doneChangingTextCallback) {
    var dialog = $('.relabelDialog');
    var getTextInput = dialog.find('.annotationTextInput');
    var confirm = dialog.find('.relabelConfirm');
    var remove = dialog.find('.relabelRemove');
    getTextInput.val(data.annotationText);
    dialog.get(0).showModal();
    confirm.off('click');
    confirm.on('click', function() {
      dialog.get(0).close();
      doneChangingTextCallback(data, getTextInput.val());
    });
    // If the remove button is clicked, delete this marker
    remove.off('click');
    remove.on('click', function() {
      dialog.get(0).close();
      doneChangingTextCallback(data, undefined, true);
    });
    dialog.off("keydown");
    dialog.on('keydown', keyPressHandler);
    function keyPressHandler(e) {
      // If Enter is pressed, close the dialog
      if (e.which === 13) {
        closeHandler();
      }
    }
    function closeHandler() {
      dialog.get(0).close();
      doneChangingTextCallback(data, getTextInput.val());
      // Reset the text value
      getTextInput.val("");
    }

  }
  var config = {
    getTextCallback : getTextCallback,
    changeTextCallback : changeTextCallback,
    drawHandles : false,
    drawHandlesOnHover : true,
    arrowFirst : true
  }

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


  cornerstone.enable(element);
  cornerstone.loadImage(image+'/file').then(function(image) {
    cornerstone.displayImage(element, image);
    // image enable the dicomImage element
    // Enable mouse and touch input
    cornerstoneTools.mouseInput.enable(element);
    cornerstoneTools.touchInput.enable(element);
    cornerstoneTools.arrowAnnotate.setConfiguration(config);
    cornerstoneTools.magnify.setConfiguration(mag_config);

  });


  $('.action').on('click',function(){
    disableTools();
    $('.btn').removeClass('active');
    cornerstone.reset(element);
  })

  // Zoom
  function activate(that){
    disableTools();
    $('.btn').removeClass('active');
    $(that).addClass('active');
  }

  function disableTools(){
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
  }

  $('a#zoom').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.zoomTouchDrag.activate(element);
    cornerstoneTools.zoom.activate(element, 1);
    return false;
  });

  $('a#rotate').on('click touchstart', function() {
    activate(this);
    // Enable all tools we want to use with this element
    cornerstoneTools.rotate.activate(element, 1);
    cornerstoneTools.rotateTouchDrag.activate(element);
    return false;
  });


  $('a#length').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.length.activate(element, 1);
    return false;
  });

  $('a#annotate').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.arrowAnnotate.activate(element, 1);
    cornerstoneTools.arrowAnnotateTouch.activate(element);
    return false;
  });

  $('a#highlight').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.highlight.activate(element, 1);
    return false;
  });

  $('a#save').on('click touchstart', function() {
    activate(this);
    var filename = $("#filename").val();
    cornerstoneTools.saveAs(element, filename);
    return false;
  });

  $('a#angle').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.simpleAngle.activate(element, 1);
    cornerstoneTools.simpleAngleTouch.activate(element);
    return false;
  });

  $('a#dragProbe').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.dragProbe.activate(element,1);
    cornerstoneTools.dragProbeTouch.activate(element);
    return false;
  });

  $('a#freehand').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.freehand.activate(element,1);
    return false;
  });

  $('a#magnify').on('click touchstart', function() {
    activate(this);
    cornerstoneTools.magnify.activate(element, 1);
    cornerstoneTools.magnifyTouchDrag.activate(element);
    return false;
  });

});
