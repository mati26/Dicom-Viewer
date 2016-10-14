(function () {

    var Metadata = function () {

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

        return {
            dumpFile: dumpFile
        };
    };

    var module = angular.module("DicomViewer");
    module.factory("Metadata", Metadata);

}());