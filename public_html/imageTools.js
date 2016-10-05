(function () {

    var imageTools = function () {

        
        var element = $('#dicomImage').get(0);

        function disableAllTools()
        {
            cornerstoneTools.mouseInput.disable(element);
            cornerstoneTools.length.deactivate(element, 1);
            cornerstoneTools.angle.deactivate(element, 1);
            cornerstoneTools.rectangleRoi.deactivate(element, 1);
            cornerstoneTools.arrowAnnotate.deactivate(element, 1);
            tool = false;
        }



        function noTool()
        {
            activate('#nonTool');
            disableAllTools();
        }

        var activate = function(id)
        {
            $('a').removeClass('active');
            $(id).addClass('active');
        }

        $('#nonTool').click(noTool);

        var length = function () {
              console.log("gaga");
            activate('#length');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.length.activate(element, 1);
        };

        var angle = function () {
            activate('#angle');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.angle.activate(element, 1);
        };

        var rectangleROI = function () {
            activate('#rectangleROI');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.rectangleRoi.activate(element, 1);
        };

        var label = function () {
            activate('#label');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.arrowAnnotate.activate(element, 1);
        };
        var test= function() {
          
        }

        return {
            length: length,
            angle: angle,
            rectangleROI: rectangleROI,
            label: label,
            test: test
        };
    };


    var module = angular.module("DicomViewer");
    module.factory("imageTools", imageTools);
}());
