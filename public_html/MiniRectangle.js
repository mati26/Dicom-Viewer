(function () {

    var MiniRectangle = function () {

        function clearCanvas(element) {
            var enabledElement = cornerstone.getEnabledElement(element);
            var cnv = enabledElement.canvas;
            var ctx = cnv.getContext('2d'); // gets reference to canvas context
            ctx.beginPath(); // clear existing drawing paths
            ctx.save(); // store the current transformation matrix

            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, cnv.width, cnv.height);
            ctx.restore(); // restore the transform
        }

        //rysowanie kwadratu w minimapie
        function drawMiniRect(element, elementMini) {
            var ctx = prepareCanvas(elementMini)
            var coords = calcCoords(element, elementMini);
            ctx.rect(coords.x1 - coords.deltax, coords.y1 - coords.deltay, coords.x2, coords.y2);
            ctx.stroke();
        }

        var prepareCanvas = function (element) {
            var enabledElement = cornerstone.getEnabledElement(element);
            var c = enabledElement.canvas;
            var ctx = c.getContext("2d");
            setBrushWithContext(ctx);
            return ctx;
        }

        var setBrushWithContext = function (ctx) {
            ctx.strokeStyle = "orange";
            ctx.lineWidth = "8";
        }

        var calcCoords = function (element, elementMini) {
            var elementRect = element.getBoundingClientRect();
            var pixelCoordsLeftTop = cornerstone.pageToPixel(element, elementRect.left, elementRect.top);
            var pixelCoordsRightBottom = cornerstone.pageToPixel(element, elementRect.right, elementRect.bottom);

            var enabledElement = cornerstone.getEnabledElement(element);
            var enabledElementMini = cornerstone.getEnabledElement(elementMini);

            return{
                x1: pixelCoordsLeftTop.x,
                y1: pixelCoordsLeftTop.y,
                x2: pixelCoordsRightBottom.x - pixelCoordsLeftTop.x,
                y2: pixelCoordsRightBottom.y - pixelCoordsLeftTop.y,
                deltax: enabledElement.viewport.translation.x * enabledElementMini.viewport.scale,
                deltay: enabledElement.viewport.translation.y * enabledElementMini.viewport.scale
            };
        }

        return{
            clearCanvas: clearCanvas,
            drawMiniRect: drawMiniRect
        }
    };

    var module = angular.module("DicomViewer");
    module.factory("MiniRectangle", MiniRectangle);

}());