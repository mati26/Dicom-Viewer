(function () {

    var ImageTools = function (Elements) {

        var element;
        var elementMini;
        var enabledTool = 'noTool';

        var setElements = function (e, eMini) {
            element = e;
            elementMini = eMini;
        }(Elements.element, Elements.elementMini);

        var setTool = function (tool) {
            enabledTool = tool;
        }

        var getTool = function () {
            return enabledTool;
        }

        var disableAllTools = function () {
            cornerstoneTools.mouseInput.disable(element);
            cornerstoneTools.length.deactivate(element, 1);
            cornerstoneTools.angle.deactivate(element, 1);
            cornerstoneTools.rectangleRoi.deactivate(element, 1);
            cornerstoneTools.arrowAnnotate.deactivate(element, 1);
        }

        var noTool = function () {
            disableAllTools();
            setTool('noTool');
        }

        var length = function () {
            disableAllTools();
            setTool('length');
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.length.activate(element, 1);
        };

        var angle = function () {
            disableAllTools();
            setTool('angle');
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.angle.activate(element, 1);
        };

        var rectangleROI = function () {
            disableAllTools();
            setTool('rectangleROI');
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.rectangleRoi.activate(element, 1);
        };

        var label = function () {
            disableAllTools();
            setTool('label');
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.arrowAnnotate.activate(element, 1);
        };

        return {
            getTool: getTool,
            noTool: noTool,
            length: length,
            angle: angle,
            rectangleROI: rectangleROI,
            label: label
        };
    };

    var module = angular.module("DicomViewer");
    module.factory("ImageTools", ImageTools);
}());
