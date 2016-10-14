(function () {

    var LoadImage = function (Elements) {

        var element;
        var elementMini;

        var imageIds = [];
        var stack = {
            currentImageIdIndex: 0,
            imageIds: imageIds
        };

        var setElements = function (e, eMini) {
            element = e;
            elementMini = eMini;
        }(Elements.element, Elements.elementMini);

        var prepareStackAndAddImagesToStack = function (files) {
            prepareStack();
            addImagesToStack(files);
        }

        var prepareStack = function () {
            imageIds = [];
            cornerstoneTools.addStackStateManager(element, ['stack']);
            cornerstoneTools.addToolState(element, 'stack', stack);
        }

        var addImagesToStack = function (files) {
            for (i = 0; i < files.length; i++)
                imageIds.push(cornerstoneWADOImageLoader.fileManager.add(files[i]));
            stack.imageIds = imageIds;
        }

        var displayImage = function (imageIndex) {
            cornerstone.loadImage(imageIds[imageIndex]).then(function (image) {
                console.log(image);
                var enabledElement = cornerstone.getEnabledElement(element);
                var enabledElementMini = cornerstone.getEnabledElement(elementMini);
                //var c = enabledElementMini.canvas;
                //clearCanvas(c);
                var viewport = cornerstone.getDefaultViewportForImage(element, image);
                cornerstone.displayImage(element, image, viewport);
                var viewportMini = cornerstone.getDefaultViewportForImage(elementMini, image);
                cornerstone.displayImage(elementMini, image, viewportMini);
            }, function (err) {
                alert(err);
            });
        }

        return {
            setElements: setElements,
            prepareStackAndAddImagesToStack: prepareStackAndAddImagesToStack,
            displayImage: displayImage,
        };
    };


    var module = angular.module("DicomViewer");
    module.factory("LoadImage", LoadImage);
}());
