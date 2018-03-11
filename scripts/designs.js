$(function() {
    /* THE SKELETON */
    //Pixel art maker logo + text
    const header = $('header#header');
    //Container of whole art maker (whole webpage except header and footer)
    const container = $('div#container');
    //Footer of the webpage
    const footer = $('footer#footer');

    /**
     * How to use?
     */
    //The heading/summary of the instructions
    const useSummary = $('h3.summary-use');
    //Div which contains the how-to-use?
    const howToUse = $('ul.ul-use');

    //Pixel table
    const table = $('table#pixelCanvas');

    //Button to download the pixel table as image(.png)
    const downButton = $('a#btn-download');
    //Button to preview thw table pixel as canvas
    const previewButton = $('button#btn-preview');
    //Button to export the pixel table as html
    const exportHtml = $('button#btn-export');

    /* FORM */
    //Form which takes in size of the pixel table and hs options to submit, reset and import
    const form = $('form#sizePicker');
    //Input for the height of the pixel table
    const inputHeight = $('input#inputHeight');
    //Inout for the width of the pixel table
    const inputWidth = $('input#inputWidth');
    //Button(input) to submit the table dimensions and draw fresh table
    const submit = $('input[type=submit]');
    //Button(input) to reset the pixel table
    const reset = $('input[type=reset]');
    //Button to let user import pixel table as html file or pasting text
    const importButton = $('#btn-import-html');
    //Input for color to be filled
    const colorPicker = $('input#colorPicker');

    //Div which contains the preview image(canvas)
    const previewImage = $('div#preview-bitmap');

    /* IMPORT MODAL */
    //Div that overlays the webpage so that when modal is opened, user cannnot interact with the webpage
    const importModalOverlay = $('#overlay-import-modal');
    //Modal that opens when user wants to import pixel table as html
    const importModal = $('#import-modal');
    //Button to upload html from modal
    const uploadHtml = $('button#upload-html');
    //Input file from modal
    const closeImportModalButton = $('#close-import-modal');
    //TextArea in which html is written or pasted
    const textAreaHtmlImport = $('textarea#write-html');
    //Button to submit input html as text
    const doneTextHtml = $('button#btn-html-text-done');

    //Tracks whether left mouse button is pressed or not
    let mouseLeftPressed = false;
    //Tracks whether right mouse button is pressed or not
    let mouseRightPressed = false;
    //Tracks on which cell has the mouse's right button has been pressed
    let rightClickBox = null;

    //Stores the current height, width of the pixel table
    let currHeight = 0, currWidth = 0;

    //Function to make pixel table with the given inputs
    function makeGrid() {
        //If the input exceeds the limit(width=70; height=100), set them equal to the limit
        if (inputWidth.val() > 70)
            inputWidth.val("70");
        if (inputHeight.val() > 100)
            inputHeight.val("100");

        const height = inputHeight.val();
        const width = inputWidth.val();

        //Clear the table
        table.children().each(function() {
            $(this).remove();
        });

        //Create the table
        for (let i = 0; i < height; ++i) {
            let str = "";
            for (let j = 0; j < width; ++j) {
                str += '<td></td>';
            }
            table.append('<tr>' + str + '</tr>');
        }
        currHeight = height;
        currWidth = width;
    }

    //Function to return the canvas form of our pixel table
    function getCanvas(func) {
        html2canvas(table.get(0)).then(function(canvas) {
            func(canvas);
        });
    }

    //Function to hide the download button (with the preview image(canvas))
    function hideDownloadButton() {
        downButton.hide();
    }

    //Function to show the download button (with the preview image(canvas))
    function showDownloadButton() {
        downButton.show();
        previewImage.show();
    }

    //Function to hide the pixel table (with the preview button and image)
    function hideTable() {
        table.hide();
        hidePreviewButton();
        hidePreviewImage();
    }

    //Function to show the pixel table (with the preview button)
    function showTable() {
        table.show();
        showPreviewButton();
    }

    //Function to hide the preview (for table) button
    function hidePreviewButton() {
        previewButton.hide();
    }

    //Function to show the preview (for table) button
    function showPreviewButton() {
        previewButton.show();
    }

    //Function to hide the `div` which contains the preview image(canvas)
    function hidePreviewImage() {
        previewImage.hide();
    }

    //Function to show the `div` which contains the preview image(canvas)
    function showPreviewImage() {
        previewImage.show();
    }

    /**
     * Function to reset our table
     * 1. Clears the table
     * 2. hides the download button(with preview image)
     * 3. Sets input dimension to 10*10
     * 4. Redraws the pixel table
     */
    function resetArt() {
        table.empty();
        table.css('opacity', 1);
        hidePreviewImage();
        inputWidth.val("10");
        inputHeight.val("10");
        makeGrid();
    }

    /**
     * Function to set the bottom margin of our content equal to (the height of footer + 30)
     * This is done to make the webpage responsive. As the width of screen
     *      decreases, the footer might expand to more than one line, so to make
     *      the contents always stay above the footer, this method is used.
     */
    function setContainerMargin() {
        container.css("margin-bottom", footer.height() + 30);
    }

    //Function to return a text file from the input text
    function makeTextFile(text) {
        let textFile = null;
        let data = new Blob([text], {type: 'text/plain'});

        textFile = window.URL.createObjectURL(data);

        return textFile;
    }

    //Function to close the import modal
    function closeImportModal() {
        importModalOverlay.hide();
        importModal.hide();
    }

    //Function to open the import modal
    function openImportModal() {
        importModalOverlay.show();
        importModal.show();
        let h = importModal.height();
        let w = importModal.width();
        importModal.height(0.8 * h);
        importModal.width(0.8 * w);
        importModal.fadeTo(0,0);
        importModal.animate({height: h, width: w, opacity: 1}, 250, "easeOutCubic");
    }

    /**
     * This is the beginning of our execution.
     * We make the default height and width of our table to be 10*10.
     * Close the import modal, hide the download button, set responsiveness and the pixel table.
     */
    inputWidth.val("10");
    inputHeight.val("10");
    closeImportModal();
    hidePreviewImage();
    setContainerMargin();
    makeGrid();

    //To make website more respponsive, we make the container always stay above the footer.
    $(window).resize(setContainerMargin);

    //Toggles the How to use? section
    useSummary.on('click', function(e) {
        $(this).toggleClass("ion-chevron-right");
        $(this).toggleClass("ion-chevron-down");
        howToUse.toggle(500);
    });

    //If user wants to import table, open inport modal
    importButton.on('click', function(e) {
        e.preventDefault();
        openImportModal();
    });

    //If the user has uploaded table, pasted the table or wants wo cancel, close the modal
    closeImportModalButton.on('click', function(e) {
        closeImportModal();
    });

    /**
     * When user has uploaded the file, check its validity.
     * If valid, update the pixel table.
     * Else, notify user
     */
    uploadHtml.on('click', function(e) {
        let inputFile = document.createElement('input');
        inputFile.setAttribute('type', 'file');
        inputFile.setAttribute('accept', 'text/html');
        inputFile.click();
        $(inputFile).on('change', function(e) {
            let reader = new FileReader();
            reader.readAsText(inputFile.files[0], 'UTF-8');
            reader.onload = function(e) {
                table.empty();
                table.html(e.target.result);
            };
            closeImportModal();
            /* TODO: $('body').off('change', inputFile, function(e) {
                console.log("Turned off listener");
            });*/
        });
    });

    /**
     * When user clicks 'Done' button in import modal, it will inject the html in the table
     */
    doneTextHtml.on('click', function(e) {
        let text = textAreaHtmlImport.val().trim();
        if (text !== undefined && text !== null && text !== "") {
            table.empty();
            table.html(text);
            textAreaHtmlImport.val("");
            closeImportModal();
        }
    });

    //When `submit` button is clicked, make the pixel table accrding to the input
    submit.on('click', function(event) {
        event.preventDefault();
        if (inputWidth.val() > 0 && inputHeight.val() > 0) {
            event.preventDefault();
            makeGrid();
            showTable();
        }
    });

    //If user clicks `reset` button, reset the pixel table
    reset.on('click', function(e) {
        e.preventDefault();
        resetArt();
        colorPicker.val("#FF9800");
    });

    //If user clicks `export` button, export the table as html
    exportHtml.on('click', function(e) {
        let tableHtml = table.html();
        let link = document.createElement('a');
        link.setAttribute('href', makeTextFile(tableHtml));
        link.setAttribute('download', 'pixel.html');
        link.click();
    });

    //Disable right click on pixel table to support erase using right click properly
    table.on('contextmenu', 'td', function() {
        return false;
    });

    //If a cell in table is clicked, fill the chosen color
    table.on('click', 'td', function(event) {
        let color = colorPicker.val();
        $(this).css('background-color', color).css('opacity', 1.0);
    });

    //If mouse is being dragged over table's cell, perform the task depending on the button pressed
    table.on('mouseover', 'td', function(event) {
        //If left button is pressed while draging, fill the chosen color in the dragged cell
        if (mouseLeftPressed) {
            let color = colorPicker.val();
            $(this).css('background-color', color).css('opacity', 1.0);
        }
        //If the right button is pressed while dragging, remove the color from the dragged cell
        else if (mouseRightPressed) {
            $(this).css('background-color', 'white').css('opacity', 0.0);
        }
    });

    //If mouse button is pressed (not clicked), update the mouse button trackers'
    table.mousedown(function(e) {
        if (e.which === 1)
            mouseLeftPressed = true;
        else if (e.which === 3) {
            mouseRightPressed = true;
            //In case of right press, store the cell on which it is pressed.
            //This is used for the right click functionality.
            rightClickBox = e.target;
        }
    });

    /**
     * If the mouse button is realeased, update the mouse button trackers'
     * If right button is realeased, check if it is a click event. If right click, remove color from the cell
     */
    table.mouseup(function(e) {
        if (e.which === 1)
            mouseLeftPressed = false;
        else if (e.which === 3) {
            //Condition for right click (If realeased button is same as pressed button)
            if (mouseRightPressed && e.target == rightClickBox) {
                $(rightClickBox ).css('background-color', 'white').css('opacity', 0.0);
                rightClickBox = null;
            }
            mouseRightPressed = false;
        }
    });

    //If `preview` button is clicked, create canvas of our pixel table and insert to the page.
    previewButton.on('click', function() {
        if (currWidth > 0 && currHeight > 0) {
            getCanvas(function(canvas) {
                previewImage.empty();
                previewImage.append(canvas);
                showDownloadButton();
            });
        }
    });

    //Downloads the pixel table as image(png).
    downButton.on('click', function(e) {
        e.preventDefault();
        if (currWidth > 0 && currHeight > 0) {
            getCanvas(function(canvas) {
                let downLink = document.createElement('a');
                let image  = canvas.toDataURL("image/png").replace(/^data:image\/png/, "data:application/octet-stream");
                downLink.setAttribute('href', image);
                downLink.setAttribute('download', 'pixel.png');
                downLink.click();
            });
        }
    });
});
