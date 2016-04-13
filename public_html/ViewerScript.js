
/* global cornerstone, cornerstoneTools, cornerstoneWADOImageLoader */

function loadAndViewImage(imageId) {
    var element = $('#dicomImage').get(0);
    //try {
    cornerstone.loadImage(imageId).then(function (image) {
        console.log(image);
        var viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);

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
        $('span[data-dicom]').each(function(index, value)
        {
            var attr = $(value).attr('data-dicom');
            var element = dataSet.elements[attr];
            var text = "";
            if(element !== undefined)
            {
                var str = dataSet.string(attr);
                if(str !== undefined) {
                    text = str;
                }
            }
            $(value).text(text);
        });

        $('span[data-dicomUint]').each(function(index, value)
        {
            var attr = $(value).attr('data-dicomUint');
            var element = dataSet.elements[attr];
            var text = "";
            if(element !== undefined)
            {
                if(element.length === 2)
                {
                    text += dataSet.uint16(attr);
                }
                else if(element.length === 4)
                {
                    text += dataSet.uint32(attr);
                }
            }

            $(value).text(text);
        });

    }


  // This function will read the file into memory and then start dumping it
    function dumpFile(file)
    {
        $('#status').removeClass('alert-warning alert-success alert-danger').addClass('alert-info');
        $('#warnings').empty();
        //document.getElementById('statusText').innerHTML = 'Status: Loading file, please wait..';

        var reader = new FileReader();
        reader.onload = function(file) {
            var arrayBuffer = reader.result;

            // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
            // Uint8Array so we create that here
            var byteArray = new Uint8Array(arrayBuffer);

            var kb = byteArray.length / 1024;
            var mb = kb / 1024;
            var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB";
            //document.getElementById('statusText').innerHTML = '<span class="glyphicon glyphicon-cog"></span>Status: Parsing ' + byteStr + ' bytes, please wait..';

            // set a short timeout to do the parse so the DOM has time to update itself with the above message
            setTimeout(function() {

                var dataSet;
                // Invoke the paresDicom function and get back a DataSet object with the contents
                try {
                    var start = new Date().getTime();

                    dataSet = dicomParser.parseDicom(byteArray);
                    // Here we call dumpDataSet to update the DOM with the contents of the dataSet
                    dumpDataSet(dataSet);

                    var end = new Date().getTime();
                    var time = end - start;
                    if(dataSet.warnings.length > 0)
                    {
                        $('#status').removeClass('alert-success alert-info alert-danger').addClass('alert-warning');
                        $('#statusText').html('Status: Warnings encountered while parsing file (file of size '+ byteStr + ' parsed in ' + time + 'ms)');

                        dataSet.warnings.forEach(function(warning) {
                            $("#warnings").append('<li>' + warning +'</li>');
                        });
                    }
                    else
                    {
                        var pixelData = dataSet.elements.x7fe00010;
                        if(pixelData) {
                            $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                            $('#statusText').html('Status: Ready (file of size '+ byteStr + ' parsed in ' + time + 'ms)');
                        }
                        else
                        {
                            $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                            $('#statusText').html('Status: Ready - no pixel data found (file of size ' + byteStr + ' parsed in ' + time + 'ms)');
                        }
                    }
                }
                catch(err)
                {
                    $('#status').removeClass('alert-success alert-info alert-warning').addClass('alert-danger');
                    document.getElementById('statusText').innerHTML = 'Status: Error - ' + err + ' (file of size ' + byteStr + ' )';
                }

            }, 30);
        };

        reader.readAsArrayBuffer(file);
    }

$(document).ready(function () {

    var element = $('#dicomImage').get(0);
    cornerstone.enable(element);

    //ladowanie obrazu
    $('#selectFile').on('change', function (e) {
        var file = e.target.files[0];
        var imageId = cornerstoneWADOImageLoader.fileManager.add(file);
        loadAndViewImage(imageId);
        
        dumpFile(file);
    });

    //powiekszanie
    $("#zoomIn").click(function () {
        var viewport = cornerstone.getViewport(element);
        viewport.scale += 0.25;
        cornerstone.setViewport(element, viewport);
    });

    //pomniejszanie
    $("#zoomOut").click(function () {
        var viewport = cornerstone.getViewport(element);
        viewport.scale -= 0.25;
        cornerstone.setViewport(element, viewport);
    });

    //domyslny
    $('#default').click(function (e) {
        cornerstone.reset(element);
    });

    //odwracanie koloru
    $('#invert').click(function (e) {
        var viewport = cornerstone.getViewport(element);
        if (viewport.invert === true) {
            viewport.invert = false;
        } else {
            viewport.invert = true;
        }
        cornerstone.setViewport(element, viewport);
    });

    //odbij poziomo
    $('#hFlip').click(function (e) {
        var viewport = cornerstone.getViewport(element);
        viewport.hflip = !viewport.hflip;
        cornerstone.setViewport(element, viewport);
    });
    
    //odbij pionowo
    $('#vFlip').click(function (e) {
        var viewport = cornerstone.getViewport(element);
        viewport.vflip = !viewport.vflip;
        cornerstone.setViewport(element, viewport);
    });

    //obroc w lewo
    $('#lRotate').click(function (e) {
        var viewport = cornerstone.getViewport(element);
        viewport.rotation -= 90;
        cornerstone.setViewport(element, viewport);
    });

    //obroc w prawo
    $('#rRotate').click(function (e) {
        var viewport = cornerstone.getViewport(element);
        viewport.rotation += 90;
        cornerstone.setViewport(element, viewport);
    });

    //przesuwanie obrazu
    $('#dicomImage').mousedown(function (e) {
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
            cornerstone.setViewport(element, viewport);
        } else {
            var viewport = cornerstone.getViewport(element);
            viewport.scale += 0.25;
            cornerstone.setViewport(element, viewport);
        }
        //prevent page fom scrolling
        return false;
    });

 

});