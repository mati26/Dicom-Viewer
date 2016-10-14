(function () {

    var app = angular.module("DicomViewer");

    var LoadImageController = function ($scope, LoadImage, Metadata, Elements, ImageTools, ImageOptions) {
        var currImageIndex = 0;

        
        $scope.fileNameChanged = function (files) {

            Elements.prepareElements();
            LoadImage.prepareStackAndAddImagesToStack(files);
            LoadImage.displayImage(currImageIndex);
            Metadata.dumpFile(files[currImageIndex]);
  
        }
    };

    app.controller("LoadImageController", LoadImageController);

}());