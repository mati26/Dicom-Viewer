(function () {

    var imageTools = function () {

        var enabledTool = 'noTool';
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

        var noTool = function () {
            this.enabledTool = 'noTool';
            disableAllTools();
        }

        var length = function () {

            this.enabledTool = 'length';
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.length.activate(element, 1);
        };

        var angle = function () {
            this.enabledTool = 'angle';
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.angle.activate(element, 1);
        };

        var rectangleROI = function () {
            this.enabledTool = 'rectangleROI';
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.rectangleRoi.activate(element, 1);
        };

        var label = function () {
            this.enabledTool = 'label';
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.arrowAnnotate.activate(element, 1);
        };

        return {
            enabledTool: enabledTool,
            noTool: noTool,
            length: length,
            angle: angle,
            rectangleROI: rectangleROI,
            label: label
        };
    };


    var module = angular.module("DicomViewer");
    module.factory("imageTools", imageTools);
}());
