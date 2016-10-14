(function () {

    var app = angular.module("DicomViewer");

    var ImageOptionsController = function ($scope, ImageOptions) {

        $scope.zoomIn = ImageOptions.zoomIn;
        $scope.zoomOut = ImageOptions.zoomOut;
        $scope.lRotate = ImageOptions.lRotate;
        $scope.rRotate = ImageOptions.rRotate;
        $scope.hFlip = ImageOptions.hFlip;
        $scope.vFlip = ImageOptions.vFlip;
        $scope.invert = ImageOptions.invert;
        $scope.defaultViewport = function () {
            ImageOptions.defaultViewport();
            document.getElementById("gammaRange").value = 1;
            document.getElementById("gammaValue").innerHTML = 1;

            $("#slider-range").slider('values', 0, 0);
            $("#slider-range").slider('values', 1, 255);
            $("#amount").val(mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 0)).toFixed(2) + ' - ' + mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 1)).toFixed(2));
        }
    };

    app.controller("ImageOptionsController", ImageOptionsController);

}());