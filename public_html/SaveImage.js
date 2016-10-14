(function () {

    var SaveImage = function (Elements) {

        var element;
        var elementMini;
        
        var setElements = function (e, eMini) {
            element = e;
            elementMini = eMini;
        }(Elements.element, Elements.elementMini);

      var save = function (filename) {
          cornerstoneTools.saveAs(element, filename);
          return false;
      }

        return {
           save: save
        };
    };

    var module = angular.module("DicomViewer");
    module.factory("SaveImage", SaveImage);
}());
