(function () {

    var CursorPosCoords = function (Elements) {

        var element = $('#dicomImage').get(0);

        var setElement = function (e) {
            element = e;
        }(Elements.element);

        

        return {
            element: element,
            elementMini: elementMini,
            prepareElements: prepareElements
        };
    };

    var module = angular.module("DicomViewer");
    module.factory("CursorPosCoords", CursorPosCoords);

}());