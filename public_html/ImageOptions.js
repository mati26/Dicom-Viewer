(function () {

    var ImageOptions = function (Elements, ImageTools, ViewportHandling, MiniRectangle) {

        var element;
        var elementMini;

        var setElements = function (e, eMini) {
            element = e;
            elementMini = eMini;
        }(Elements.element, Elements.elementMini);

        var zoomIn = function () {
            var viewport = ViewportHandling.zoomIn(element);
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.zoomInOutMini(elementMini, viewport)
            MiniRectangle.drawMiniRect(element, elementMini);
        }

        var zoomOut = function () {
            var viewport = ViewportHandling.zoomOut(element);
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.zoomInOutMini(elementMini, viewport)
            MiniRectangle.drawMiniRect(element, elementMini);
        }

        var lRotate = function () {
            ViewportHandling.lRotate(element);
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.lRotate(elementMini);
            MiniRectangle.drawMiniRect(element, elementMini);
        }

        var rRotate = function () {
            ViewportHandling.rRotate(element);
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.rRotate(elementMini);
            MiniRectangle.drawMiniRect(element, elementMini);
        }

        var hFlip = function () {
            ViewportHandling.hFlip(element);
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.hFlip(elementMini);
            MiniRectangle.drawMiniRect(element, elementMini);
        }

        var vFlip = function () {
            ViewportHandling.vFlip(element);
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.vFlip(elementMini);
            MiniRectangle.drawMiniRect(element, elementMini);
        }

        var invert = function () {
            ViewportHandling.invert(element);
            ViewportHandling.invert(elementMini);
            MiniRectangle.drawMiniRect(element, elementMini);
        }

        var defaultViewport = function () {
            ViewportHandling.reset(element);
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.reset(elementMini);
        }

        //zoomowanie kolkiem myszy
        $('#dicomImage').on('mousewheel DOMMouseScroll', function (e) {
            if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) {
                var viewport = ViewportHandling.zoomOut(element);
            } else {
                var viewport = ViewportHandling.zoomIn(element);
            }
            MiniRectangle.clearCanvas(elementMini);
            ViewportHandling.zoomInOutMini(elementMini, viewport);
            MiniRectangle.drawMiniRect(element, elementMini);
            //prevent page fom scrolling
            return false;
        });

        //przesuwanie obrazu
        $('#dicomImage').mousedown(function (e) {
            move(e, ViewportHandling.moveNormal);
        });
        //przesuwanie obrazu mini
        $('#dicomMini').mousedown(function (e) {
            move(e, ViewportHandling.moveMini);
        });

        var move = function (e, moveFunction) {
            if (ImageTools.getTool() === 'noTool')
            {
                var lastX = e.pageX;
                var lastY = e.pageY;
                $(document).mousemove(function (e) {
                    var deltaX = e.pageX - lastX;
                    var deltaY = e.pageY - lastY;
                    lastX = e.pageX;
                    lastY = e.pageY;
                    var viewport = moveFunction(element, deltaX, deltaY);
                    MiniRectangle.clearCanvas(elementMini);
                    ViewportHandling.zoomInOutMini(elementMini, viewport);
                    MiniRectangle.drawMiniRect(element, elementMini);

                });
                $(document).mouseup(function (e) {
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                });
            }
        };

        return {
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            lRotate: lRotate,
            rRotate: rRotate,
            hFlip: hFlip,
            vFlip: vFlip,
            invert: invert,
            defaultViewport: defaultViewport
        };
    };


    var module = angular.module("DicomViewer");
    module.factory("ImageOptions", ImageOptions);
}());
