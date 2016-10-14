(function () {

    var Elements = function () {

        var element = $('#dicomImage').get(0);
        var elementMini = $('#dicomMini').get(0);

        var prepareElements = function () {
            cornerstone.enable(element);
            cornerstone.enable(elementMini);
        };

        return {
            element: element,
            elementMini: elementMini,
            prepareElements: prepareElements
        };
    };

    var module = angular.module("DicomViewer");
    module.factory("Elements", Elements);

}());