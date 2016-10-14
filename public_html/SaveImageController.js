(function () {

    var app = angular.module("DicomViewer");

    var SaveImageController = function ($scope, SaveImage) {
       
        $scope.filename;
        $scope.save = function() {
            SaveImage.save($scope.filename);
        };
    };

    app.controller("SaveImageController", SaveImageController);

}());