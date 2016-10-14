(function () {

    var app = angular.module("DicomViewer");

    var ImageToolsController = function ($scope, ImageTools) {

        $scope.getTool = ImageTools.getTool;
        $scope.noTool = ImageTools.noTool;
        $scope.length = ImageTools.length;
        $scope.angle = ImageTools.angle;
        $scope.rectangleROI = ImageTools.rectangleROI;
        $scope.label = ImageTools.label;
        
    };

    app.controller("ImageToolsController", ImageToolsController);

}());