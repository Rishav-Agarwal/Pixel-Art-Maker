$(function() {
    const table = $('table#pixelCanvas');
    const form = $('form#sizePicker');
    const downButton = $('a#btn-download');
    const previewButton = $('button#btn-preview');
    const inputHeight = $('input#inputHeight');
    const inputWidth = $('input#inputWidth');
    const submit = $('input[type=submit]');
    const reset = $('input[type=reset]');
    const previewImage = $('div#preview-bitmap');
    var mouseLeftPressed = false;
    var mouseRightPressed = false;
    var currHeight = 0, currWidth = 0;

    function makeGrid() {
        const height = inputHeight.val();
        const width = inputWidth.val();

        table.children().each(function() {
            $(this).remove();
        });

        for (var i = 0; i < height; ++i) {
            var str = "";
            for (var j = 0; j < width; ++j) {
                str += '<td></td>';
            }
            table.append('<tr>' + str + '</tr>');
        }
        currHeight = height;
        currWidth = width;
    }

    function getCanvas(func) {
        html2canvas(table).then(function(canvas) {
            func(canvas);
        });
    }

    function hideDownloadButton() {
        downButton.hide();
        previewImage.hide();
    }

    function showDownloadButton() {
        downButton.show();
        previewImage.show();
    }

    function hideTable() {
        table.hide();
        hidePreviewButton();
        hidePreviewImage();
    }

    function showTable() {
        table.show();
        showPreviewButton();
    }

    function hidePreviewButton() {
        previewButton.hide();
    }

    function showPreviewButton() {
        previewButton.show();
    }

    function hidePreviewImage() {
        previewImage.hide();
    }

    function showPreviewImage() {
        previewImage.show();
    }

    function resetArt() {
        table.children().each(function() {
            $(this).remove();
        });
        hideTable();
        hideDownloadButton();
    }

    hideDownloadButton();
    hideTable();

    submit.on('click', function(event) {
        if (inputWidth.val() > 0 && inputHeight.val() > 0) {
            event.preventDefault();
            makeGrid();
            showTable();
        }
    });

    reset.on('click', function() {
        resetArt();
    });

    table.on('contextmenu', 'td', function() {
        return false;
    });

    table.on('click', 'td', function(event) {
        var color = $('input[type = "color"]').val();
        $(this).css('background-color', color).css('opacity', 1.0);
    });

    table.on('mouseover', 'td', function(event) {
        if (mouseLeftPressed) {
            var color = $('input[type = "color"]').val();
            $(this).css('background-color', color).css('opacity', 1.0);
        } else if (mouseRightPressed) {
            $(this).css('background-color', 'white').css('opacity', 0.0);
        }
    });

    table.mousedown(function(e) {
        if (e.which === 1)
            mouseLeftPressed = true;
        else if (e.which === 3) {
            mouseRightPressed = true;
            rightClickBox = e.target;
        }
    });

    table.mouseup(function(e) {
        if (e.which === 1)
            mouseLeftPressed = false;
        else if (e.which === 3) {
            if (mouseRightPressed && e.target == rightClickBox) {
                $(rightClickBox ).css('background-color', 'white').css('opacity', 0.0);
                rightClickBox = null;
            }
            mouseRightPressed = false;
        }
    });

    previewButton.click(function() {
        if (currWidth > 0 && currHeight > 0) {
            getCanvas(function(canvas) {
                $('#preview-bitmap').children().remove();
                $('#preview-bitmap').append(canvas);
                var image = canvas.toDataURL("image/png").replace(/^data:image\/png/, "data:application/octet-stream");
                $('#btn-download').attr("href", image);
                showDownloadButton();
            });
        }
    });
});
