
(function () {
    var app = angular.module("DicomViewer", []);

    var ImageOptionsController = function ($scope) {

        var element = $('#dicomImage').get(0);
        var elementMini = $('#dicomMini').get(0)

        $scope.zoomIn = function () {

            var viewport = cornerstone.getViewport(element);
            viewport.scale += 0.25;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var tempScale = enabledElementMini.viewport.scale;
            cornerstone.reset(elementMini);
            viewport.scale = tempScale;
            viewport.translation.x = 0;
            viewport.translation.y = 0;
            cornerstone.setViewport(elementMini, viewport);
            drawMiniRect(element, elementMini);

        };

        $scope.zoomOut = function () {
            var viewport = cornerstone.getViewport(element);
            viewport.scale -= 0.25;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var tempScale = enabledElementMini.viewport.scale;
            cornerstone.reset(elementMini);
            viewport.scale = tempScale;
            viewport.translation.x = 0;
            viewport.translation.y = 0;
            cornerstone.setViewport(elementMini, viewport);
            drawMiniRect(element, elementMini);
        };


        $scope.lRotate = function () {
            var viewport = cornerstone.getViewport(element);
            viewport.rotation -= 90;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var viewportMini = cornerstone.getViewport(elementMini);
            viewportMini.rotation -= 90;
            cornerstone.setViewport(elementMini, viewportMini);
            drawMiniRect(element, elementMini);
        };

        $scope.rRotate = function () {
            var viewport = cornerstone.getViewport(element);
            viewport.rotation += 90;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var viewportMini = cornerstone.getViewport(elementMini);
            viewportMini.rotation += 90;
            cornerstone.setViewport(elementMini, viewportMini);
            drawMiniRect(element, elementMini);
        }

        //odbij poziomo
        $scope.hFlip = function () {
            var viewport = cornerstone.getViewport(element);
            viewport.hflip = !viewport.hflip;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var viewportMini = cornerstone.getViewport(elementMini);
            viewportMini.hflip = !viewportMini.hflip;
            cornerstone.setViewport(elementMini, viewportMini);
            drawMiniRect(element, elementMini);
        };

        //odbij pionowo
        $scope.vFlip = function () {
            var viewport = cornerstone.getViewport(element);
            viewport.vflip = !viewport.vflip;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var viewportMini = cornerstone.getViewport(elementMini);
            viewportMini.vflip = !viewportMini.vflip;
            cornerstone.setViewport(elementMini, viewportMini);
            drawMiniRect(element, elementMini);
        };

        $scope.invert = function () {
            var viewport = cornerstone.getViewport(element);
            if (viewport.invert === true) {
                viewport.invert = false;
            } else {
                viewport.invert = true;
            }
            cornerstone.setViewport(element, viewport);

            var viewportMini = cornerstone.getViewport(elementMini);
            if (viewportMini.invert === true) {
                viewportMini.invert = false;
            } else {
                viewportMini.invert = true;
            }
            cornerstone.setViewport(elementMini, viewportMini);

            drawMiniRect(element, elementMini);
        }

        $scope.defaultViewport = function () {
            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            cornerstone.reset(elementMini);
            cornerstone.reset(element);
            document.getElementById("gammaRange").value = 1;
            document.getElementById("gammaValue").innerHTML = 1;
            globalCounter = 0;
            $("#slider-range").slider('values', 0, 0);
            $("#slider-range").slider('values', 1, 255);
            $("#amount").val(mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 0)).toFixed(2) + ' - ' + mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 1)).toFixed(2));
        }
    };

    var files = [];
    var x1, x2, y1, y2;
    var deltax, deltay;
    var tool = false;
    var server = false;

    var mapRange = function (from, to, s) {
        return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
    };

    var getJSON = function (url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var status = xhr.status;
                if (status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(status);
                }
            };
            xhr.send();
        });
    };


    $(function () {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 255,
            values: [0, 255],
            minValue: 0,
            maxValue: 1,
            slide: function (event, ui) {
                minValue = mapRange([0, 255], [0, 1], ui.values[0]).toFixed(2);
                maxValue = mapRange([0, 255], [0, 1], ui.values[1]).toFixed(2);
                $("#amount").val(minValue + " - " + maxValue);

            }
        });
        $("#amount").val(mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 0)).toFixed(2) + ' - ' + mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 1)).toFixed(2));
    });

    $(function () {
        $("#slider").slider();
    });

//rysowanie kwadratu w minimapie
    function drawMiniRect(element, elementMini)
    {
        var enabledElement = cornerstone.getEnabledElement(element);
        var enabledElementMini = cornerstone.getEnabledElement(elementMini);
        var c = enabledElementMini.canvas;




        var ctx = c.getContext("2d");
        ctx.strokeStyle = "orange";
        ctx.lineWidth = "8";
        var elementRect = element.getBoundingClientRect();
        var pixelCoordsLeftTop = cornerstone.pageToPixel(element, elementRect.left, elementRect.top);
        var pixelCoordsRightBottom = cornerstone.pageToPixel(element, elementRect.right, elementRect.bottom);

        x1 = pixelCoordsLeftTop.x;
        y1 = pixelCoordsLeftTop.y;

        x2 = pixelCoordsRightBottom.x - pixelCoordsLeftTop.x;
        y2 = pixelCoordsRightBottom.y - pixelCoordsLeftTop.y;



        deltax = enabledElement.viewport.translation.x * enabledElementMini.viewport.scale;
        deltay = enabledElement.viewport.translation.y * enabledElementMini.viewport.scale;
        ctx.rect(x1 - deltax, y1 - deltay, x2, y2);

        ctx.stroke();
    }

    function clearCanvas(cnv) {
        var ctx = cnv.getContext('2d');     // gets reference to canvas context
        ctx.beginPath();    // clear existing drawing paths
        ctx.save();         // store the current transformation matrix

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        ctx.restore();        // restore the transform
    }





    function loadAndViewImage(imageId) {
        var element = $('#dicomImage').get(0);
        var elementMini = $('#dicomMini').get(0);

        //try {
        cornerstone.loadImage(imageId).then(function (image) {
            console.log(image);
            var enabledElement = cornerstone.getEnabledElement(element);
            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            var c = enabledElementMini.canvas;
            clearCanvas(c);

            var viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);

            var viewportMini = cornerstone.getDefaultViewportForImage(elementMini, image);
            cornerstone.displayImage(elementMini, image, viewportMini);

            var enabledElement = cornerstone.getEnabledElement(element);
            var enabledElementMini = cornerstone.getEnabledElement(elementMini);


            //$('#dicomSize').text("CanvasHeight= " + enabledElement.canvas.height + ", CanvasWidth= " + enabledElement.canvas.width + ", ImageHeight= " + enabledElement.image.height + ", ImageWidt= " + enabledElement.image.width);
            // $('#dicomMiniSize').text("CanvasHeight= " + enabledElementMini.canvas.height + ", CanvasWidth= " + enabledElementMini.canvas.width + ", ImageHeight= " + enabledElementMini.image.height + ", ImageWidt= " + enabledElementMini.image.width);

            cornerstoneTools.length.enable(element);

        }, function (err) {
            alert(err);
        });
        /*}
         catch(err) {
         alert(err);
         }*/
    }

    function dumpDataSet(dataSet)
    {
        $('span[data-dicom]').each(function (index, value)
        {
            var attr = $(value).attr('data-dicom');
            var element = dataSet.elements[attr];
            var text = "";
            if (element !== undefined)
            {
                var str = dataSet.string(attr);
                if (str !== undefined) {
                    text = str;
                }
            }
            $(value).text(text);
        });

        $('span[data-dicomUint]').each(function (index, value)
        {
            var attr = $(value).attr('data-dicomUint');
            var element = dataSet.elements[attr];
            var text = "";
            if (element !== undefined)
            {
                if (element.length === 2)
                {
                    text += dataSet.uint16(attr);
                } else if (element.length === 4)
                {
                    text += dataSet.uint32(attr);
                }
            }

            $(value).text(text);
        });

    }

    function selectImage(event) {
        var targetElement = document.getElementById("dicomImage");
        var targetElementMini = document.getElementById("dicomMini");


        // Get the range input value
        var newImageIdIndex = parseInt(event.currentTarget.value, 10);


        var stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
        if (stackToolDataSource === undefined) {
            return;
        }
        var stackData = stackToolDataSource.data[0];


        if (newImageIdIndex !== stackData.currentImageIdIndex && stackData.imageIds[newImageIdIndex] !== undefined) {
            cornerstone.loadAndCacheImage(stackData.imageIds[newImageIdIndex]).then(function (image) {
                var viewport = cornerstone.getViewport(targetElement);
                var viewportMini = cornerstone.getViewport(targetElementMini);
                stackData.currentImageIdIndex = newImageIdIndex;
                cornerstone.displayImage(targetElement, image, viewport);

                var enabledTargetElementMini = cornerstone.getEnabledElement(targetElementMini);
                clearCanvas(enabledTargetElementMini.canvas);
                cornerstone.reset(targetElementMini);

                cornerstone.displayImage(targetElementMini, image, viewportMini);

                drawMiniRect(targetElement, targetElementMini);

                stackRange = document.getElementById('stackRange');
                $('#stackNum').text(parseInt(stackRange.value) + 1 + "/" + (parseInt(stackRange.max) + 1));

                if (server === false) {
                    dumpFile(files[newImageIdIndex]);
                    document.getElementById("filename").value = files[newImageIdIndex].name.replace("dcm", "png");
                } else
                    document.getElementById("filename").value = parseInt(stackRange.value) + 1 + "/" + (parseInt(stackRange.max) + 1 + ".png");



            });
        }
    }



    function dumpFile(file)
    {
        $('#status').removeClass('alert-warning alert-success alert-danger').addClass('alert-info');
        $('#warnings').empty();
        //document.getElementById('statusText').innerHTML = 'Status: Loading file, please wait..';

        var reader = new FileReader();
        reader.onload = function (file) {
            var arrayBuffer = reader.result;

            // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
            // Uint8Array so we create that here
            var byteArray = new Uint8Array(arrayBuffer);

            var kb = byteArray.length / 1024;
            var mb = kb / 1024;
            var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB";
            //document.getElementById('statusText').innerHTML = '<span class="glyphicon glyphicon-cog"></span>Status: Parsing ' + byteStr + ' bytes, please wait..';

            // set a short timeout to do the parse so the DOM has time to update itself with the above message
            setTimeout(function () {

                var dataSet;
                // Invoke the paresDicom function and get back a DataSet object with the contents
                try {
                    var start = new Date().getTime();

                    dataSet = dicomParser.parseDicom(byteArray);
                    // Here we call dumpDataSet to update the DOM with the contents of the dataSet
                    dumpDataSet(dataSet);

                    var end = new Date().getTime();
                    var time = end - start;
                    if (dataSet.warnings.length > 0)
                    {
                        $('#status').removeClass('alert-success alert-info alert-danger').addClass('alert-warning');
                        $('#statusText').html('Status: Warnings encountered while parsing file (file of size ' + byteStr + ' parsed in ' + time + 'ms)');

                        dataSet.warnings.forEach(function (warning) {
                            $("#warnings").append('<li>' + warning + '</li>');
                        });
                    } else
                    {
                        var pixelData = dataSet.elements.x7fe00010;
                        if (pixelData) {
                            $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                            $('#statusText').html('Status: Ready (file of size ' + byteStr + ' parsed in ' + time + 'ms)');
                        } else
                        {
                            $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                            $('#statusText').html('Status: Ready - no pixel data found (file of size ' + byteStr + ' parsed in ' + time + 'ms)');
                        }
                    }
                } catch (err)
                {
                    $('#status').removeClass('alert-success alert-info alert-warning').addClass('alert-danger');
                    document.getElementById('statusText').innerHTML = 'Status: Error - ' + err + ' (file of size ' + byteStr + ' )';
                }

            }, 30);
        };

        reader.readAsArrayBuffer(file);
    }

    function activate(id)
    {
        $('a').removeClass('active');
        $(id).addClass('active');
    }



    $(document).ready(function () {


        var imageIds = [];

        var stack = {
            currentImageIdIndex: 0,
            imageIds: imageIds
        };
        var stackRange;

        var element = $('#dicomImage').get(0);
        cornerstone.enable(element);

        var elementMini = $('#dicomMini').get(0);
        cornerstone.enable(elementMini);

        // set the stack as tool state
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);

        //ladowanie obrazu
        $('#selectFile').on('change', function (e) {
            document.getElementById("gammaRange").value = 1;
            document.getElementById("gammaValue").innerHTML = document.getElementById("gammaRange").value;
            $("#slider-range").slider('values', 0, 0);
            $("#slider-range").slider('values', 1, 255);
            $("#amount").val(mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 0)).toFixed(2) + ' - ' + mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 1)).toFixed(2));
            server = false;
            files = [];
            imageIds = [];
            files = e.target.files;

            for (i = 0; i < files.length; i++)
                imageIds.push(cornerstoneWADOImageLoader.fileManager.add(files[i]));

            stack.imageIds = imageIds;
            loadAndViewImage(imageIds[0]);

            dumpFile(files[0]);
            document.getElementById("filename").value = files[0].name.replace("dcm", "png");

            stackRange = document.getElementById('stackRange');
            stackRange.value = 0;
            stackRange.max = imageIds.length - 1;

            if (imageIds.length === 1)
                document.getElementById('stackDiv').style.visibility = "hidden";
            else
                document.getElementById('stackDiv').style.visibility = "visible";
            globalCounter = 0;


            $('#stackNum').text(parseInt(stackRange.value) + 1 + "/" + (parseInt(stackRange.max) + 1));
            noTool();
        });

        $("#stackRange").on("input", selectImage);


        function downloadAndView() {

            server = true;
            var urlOrig = $('#wadoURL').val();

            // prefix the url with wadouri: so cornerstone can find the image loader

            $.getJSON(urlOrig, function (jd) {
                var numOfFrames = jd.MainDicomTags.NumberOfFrames;

                url = "wadouri:" + urlOrig + "/file";
                // image enable the dicomImage element and activate a few tools
                loadAndViewImage(url);

                $('.meta').text("");
                document.getElementById("gammaRange").value = 1;
                document.getElementById("gammaValue").innerHTML = document.getElementById("gammaRange").value;
                $("#slider-range").slider('values', 0, 0);
                $("#slider-range").slider('values', 1, 255);
                $("#amount").val(mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 0)).toFixed(2) + ' - ' + mapRange([0, 255], [0, 1], $("#slider-range").slider("values", 1)).toFixed(2));

                files = [];
                imageIds = [];

                for (i = 0; i < numOfFrames; i++)
                    files.push(urlOrig + '?frame=' + (i + 0));

                for (i = 0; i < numOfFrames; i++)
                    imageIds.push(url + '?frame=' + (i + 0));

                stack.imageIds = imageIds;
                loadAndViewImage(imageIds[0]);

                //dumpFile(files[0]);
                //document.getElementById("filename").value = files[0].name.replace("dcm", "png");

                stackRange = document.getElementById('stackRange');
                stackRange.value = 0;
                stackRange.max = imageIds.length - 1;

                document.getElementById("filename").value = parseInt(stackRange.value) + 1 + "/" + (parseInt(stackRange.max) + 1 + ".png");

                if (imageIds.length === 1)
                    document.getElementById('stackDiv').style.visibility = "hidden";
                else
                    document.getElementById('stackDiv').style.visibility = "visible";
                globalCounter = 0;


                $('#stackNum').text(parseInt(stackRange.value) + 1 + "/" + (parseInt(stackRange.max) + 1));
                noTool();

            });
        }


        $('#gammaRange').on('input', function () {
            var gamma = document.getElementById("gammaRange").value;
            document.getElementById("gammaValue").innerHTML = gamma;
            var viewport = cornerstone.getViewport(element);
            viewport.gammaCorrect = gamma;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var viewportMini = cornerstone.getViewport(elementMini);
            viewportMini.gammaCorrect = gamma;
            cornerstone.setViewport(elementMini, viewportMini);
            drawMiniRect(element, elementMini);

        });




        $("#slider-range").on('slide', function (  ) {

            var minValue = $("#slider-range").slider("values", 0);
            var maxValue = $("#slider-range").slider("values", 1);
            var viewport = cornerstone.getViewport(element);


            viewport.minValue = minValue;
            viewport.maxValue = maxValue;
            cornerstone.setViewport(element, viewport);

            var enabledElementMini = cornerstone.getEnabledElement(elementMini);
            clearCanvas(enabledElementMini.canvas);
            var viewportMini = cornerstone.getViewport(elementMini);

            viewportMini.minValue = minValue;
            viewportMini.maxValue = maxValue;
            cornerstone.setViewport(elementMini, viewportMini);
            drawMiniRect(element, elementMini);


        });







        $('#download').click(function (e) {
            downloadAndView();

        });

        //przesuwanie obrazu
        $('#dicomImage').mousedown(function (e) {
            if (tool === true)
                ;
            else
            {
                var lastX = e.pageX;
                var lastY = e.pageY;

                $(document).mousemove(function (e) {
                    var deltaX = e.pageX - lastX,
                            deltaY = e.pageY - lastY;
                    lastX = e.pageX;
                    lastY = e.pageY;

                    var viewport = cornerstone.getViewport(element);
                    viewport.translation.x += (deltaX / viewport.scale);
                    viewport.translation.y += (deltaY / viewport.scale);
                    cornerstone.setViewport(element, viewport);

                    var enabledElement = cornerstone.getEnabledElement(element);
                    var enabledElementMini = cornerstone.getEnabledElement(elementMini);
                    clearCanvas(enabledElementMini.canvas);


                    var tempScale = enabledElementMini.viewport.scale;
                    cornerstone.reset(elementMini);
                    viewport.scale = tempScale;
                    viewport.translation.x = 0;
                    viewport.translation.y = 0;
                    cornerstone.setViewport(elementMini, viewport);



                    drawMiniRect(element, elementMini);

                    $('#defaultViewport').text("enabledElementViewport= " + enabledElement.viewport.scale + "  enabledElementMiniViewport= " + enabledElementMini.viewport.scale);

                });

                $(document).mouseup(function (e) {
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                });
            }
        });


        //przesuwanie obrazu mini
        $('#dicomMini').mousedown(function (e) {
            var lastX = e.pageX;
            var lastY = e.pageY;

            $(document).mousemove(function (e) {
                var deltaX = e.pageX - lastX,
                        deltaY = e.pageY - lastY;
                lastX = e.pageX;
                lastY = e.pageY;

                var viewport = cornerstone.getViewport(element);
                viewport.translation.x -= (deltaX / viewport.scale);
                viewport.translation.y -= (deltaY / viewport.scale);
                cornerstone.setViewport(element, viewport);

                var enabledElement = cornerstone.getEnabledElement(element);
                var enabledElementMini = cornerstone.getEnabledElement(elementMini);


                clearCanvas(enabledElementMini.canvas);


                var tempScale = enabledElementMini.viewport.scale;
                cornerstone.reset(elementMini);
                viewport.scale = tempScale;
                viewport.translation.x = 0;
                viewport.translation.y = 0;
                cornerstone.setViewport(elementMini, viewport);

                drawMiniRect(element, elementMini);

                $('#defaultViewport').text("enabledElementViewport= " + enabledElement.viewport.scale + "  enabledElementMiniViewport= " + enabledElementMini.viewport.scale);

            });

            $(document).mouseup(function (e) {
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        });


        //zoomowanie kolkiem myszy
        $('#dicomImage').on('mousewheel DOMMouseScroll', function (e) {
            if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) {
                var viewport = cornerstone.getViewport(element);
                viewport.scale -= 0.25;
                globalCounter -= 0.5;
                cornerstone.setViewport(element, viewport);

            } else {
                var viewport = cornerstone.getViewport(element);
                viewport.scale += 0.25;
                globalCounter += 0.5;
                cornerstone.setViewport(element, viewport);

            }
            var enabledElementMini = cornerstone.getEnabledElement(elementMini);

            clearCanvas(enabledElementMini.canvas);


            var tempScale = enabledElementMini.viewport.scale;
            cornerstone.reset(elementMini);
            viewport.scale = tempScale;
            viewport.translation.x = 0;
            viewport.translation.y = 0;
            cornerstone.setViewport(elementMini, viewport);


            drawMiniRect(element, elementMini);



            //prevent page fom scrolling
            return false;
        });

        $('#save').click(function () {
            var filename = $("#filename").val();
            cornerstoneTools.saveAs(element, filename);
            return false;
        });

        function disableAllTools()
        {
            cornerstoneTools.mouseInput.disable(element);
            cornerstoneTools.length.deactivate(element, 1);
            cornerstoneTools.angle.deactivate(element, 1);
            cornerstoneTools.rectangleRoi.deactivate(element, 1);
            cornerstoneTools.arrowAnnotate.deactivate(element, 1);
            tool = false;

        }



        function noTool()
        {
            activate('#nonTool');
            disableAllTools();
        }

        $('#nonTool').click(noTool);

        $('#length').click(function () {
            activate('#length');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.length.activate(element, 1);

        });

        $('#angle').click(function () {
            activate('#angle');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.angle.activate(element, 1);
        });

        $('#rectangleROI').click(function () {
            activate('#rectangleROI');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.rectangleRoi.activate(element, 1);
        });

        $('#label').click(function () {
            activate('#label');
            disableAllTools();
            tool = true;
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.arrowAnnotate.activate(element, 1);
        });

        $(element).mousemove(function (event)
        {
            var pixelCoords = cornerstone.pageToPixel(element, event.pageX, event.pageY);

            $('#coords').text("pageX=" + event.pageX + ", pageY=" + event.pageY + ", pixelX=" + pixelCoords.x + ", pixelY=" + pixelCoords.y);
            var enabledElement = cornerstone.getEnabledElement(element).image;
            var suffix = ' mm';
            if (!enabledElement.rowPixelSpacing || !enabledElement.columnPixelSpacing) {
                suffix = ' pixels';
            }
            var x = pixelCoords.x * (enabledElement.columnPixelSpacing || 1);
            var y = pixelCoords.y * (enabledElement.rowPixelSpacing || 1);
            $('#pixCoords').text(" X = " + x.toFixed(2) + suffix + ", Y = " + y.toFixed(2) + suffix);
            var viewport = cornerstone.getViewport(element);
            $('#trans').text("Scale= " + viewport.scale + " translationX= " + viewport.translation.x + ", translationY= " + viewport.translation.y);
            $('#globalCounter').text("GlobalCounter= " + globalCounter);

            var enabledElement = cornerstone.getEnabledElement(element);
            var enabledElementMini = cornerstone.getEnabledElement(elementMini);


            var elementRect = element.getBoundingClientRect();
            $('#elRect').text("left: " + elementRect.left + "  right: " + elementRect.right + "  top: " + elementRect.top + " bottom: " + elementRect.bottom);
        });
    });


    app.controller("ImageOptionsController", ImageOptionsController);
}());