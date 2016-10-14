(function () {

    var ViewportHandling = function () {

        var zoomIn = function (element) {
            var viewport = cornerstone.getViewport(element);
            viewport.scale += 0.25;
            cornerstone.setViewport(element, viewport);
            return viewport;
        }

        var zoomInOutMini = function (element, viewport) {
            var enabledElement = cornerstone.getEnabledElement(element);
            var tempScale = enabledElement.viewport.scale;
            viewport.scale = tempScale;
            viewport.translation.x = 0;
            viewport.translation.y = 0;
            cornerstone.setViewport(element, viewport);
        }

        var zoomOut = function (element) {
            var viewport = cornerstone.getViewport(element);
            viewport.scale -= 0.25;
            cornerstone.setViewport(element, viewport);
            return viewport;
        }

        var lRotate = function (element) {
            var viewport = cornerstone.getViewport(element);
            viewport.rotation -= 90;
            cornerstone.setViewport(element, viewport);
        }

        var rRotate = function (element) {
            var viewport = cornerstone.getViewport(element);
            viewport.rotation += 90;
            cornerstone.setViewport(element, viewport);
        }

        var hFlip = function (element) {
            var viewport = cornerstone.getViewport(element);
            viewport.hflip = !viewport.hflip;
            cornerstone.setViewport(element, viewport);
        }

        var vFlip = function (element) {
            var viewport = cornerstone.getViewport(element);
            viewport.vflip = !viewport.vflip;
            cornerstone.setViewport(element, viewport);
        }

        var invert = function (element) {
            var viewport = cornerstone.getViewport(element);
            if (viewport.invert === true) {
                viewport.invert = false;
            } else {
                viewport.invert = true;
            }
            cornerstone.setViewport(element, viewport);
        }

        var reset = function (element) {
            cornerstone.reset(element);
        }

        var moveNormal = function (element, deltaX, deltaY) {
            var viewport = cornerstone.getViewport(element);
            viewport.translation.x += (deltaX / viewport.scale);
            viewport.translation.y += (deltaY / viewport.scale);
            cornerstone.setViewport(element, viewport);
            return viewport;
        }
        
        var moveMini = function (element, deltaX, deltaY) {
            var viewport = cornerstone.getViewport(element);
            viewport.translation.x -= (deltaX / viewport.scale);
            viewport.translation.y -= (deltaY / viewport.scale);
            cornerstone.setViewport(element, viewport);
            return viewport;
        }

        return {
            zoomIn: zoomIn,
            zoomInOutMini: zoomInOutMini,
            zoomOut: zoomOut,
            lRotate: lRotate,
            rRotate: rRotate,
            hFlip: hFlip,
            vFlip: vFlip,
            invert: invert,
            reset: reset,
            moveNormal: moveNormal,
            moveMini: moveMini
        };
    };

    var module = angular.module("DicomViewer");
    module.factory("ViewportHandling", ViewportHandling);
}());
